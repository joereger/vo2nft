//let throng = require('throng');
const { Worker, Job, Queue, QueueScheduler } = require('bullmq');
//const Redis = require('ioredis');
//let redis_client = new Redis(process.env.REDIS_URL, {maxRetriesPerRequest: null, enableReadyCheck: false} );
let redis_client = require('../config/redis-client.js'); 
const db = require('../models/index.js');
const StravaThrottleError = require('./strava-error-throttle.js');
const StravaAuthError = require('./strava-error-auth.js');
const StravaApiThrottler = require('./strava-api-throttler.js');

var startStravaWorkers = exports.startStravaWorkers = () => {
    console.log("strava-worker.js startStravaWorkers called");

    const worker = new Worker('stravaActivitySyncComplete', async (job) => {
        console.log("STARTING stravaActivitySyncComplete job.id="+job.id+" job.name="+job.name+" job.queueName="+job.queueName);

        try { 
            const StravaAccount = db.sequelize.models.StravaAccount;
            StravaAccount.findOne({
                where: {
                    id: job.data.stravaAccountId
                }
            }).then(
                stravaAccountLive => {
                    //console.log("strava-worker stravaAccountLive.id="+stravaAccountLive?.id);
                    stravaAccountLive.is_syncing = false;
                    stravaAccountLive.save().then(()=>{
                        //console.log("stravaAccountLive.save() called setting IS_SYNCING=false");   
                    });
                },
                err => next(err)
            )
        } catch (err) {
            console.log("stravaActivitySyncComplete error #2");
            console.log(err);
        }

        console.log("DONE DONE DONE stravaActivitySyncComplete job.id="+job.id);
        return;
    }, { connection: redis_client, concurrency: 50 } );

    worker.on('error', err => {
        console.error(err);
    });


    const worker2 = new Worker('stravaActivitySync', async (job) => {
        console.log("STARTING stravaActivitySync job.id="+job.id+" job.name="+job.name+" job.queueName="+job.queueName+" job.data.page="+job.data.page+" job.data.per_page="+job.data.per_page);
        //console.log("STARTING stravaActivitySync parentKey="+job?.parentKey);   
        //console.log("STARTING stravaActivitySync parent="+JSON.stringify(job?.parent));
    

        try{

            const stravaApiWrapper = require("./strava-api-wrapper"); 
            const StravaAccount = db.sequelize.models.StravaAccount;
            const stravaAccount = await StravaAccount.findOne({
                where: {
                    id: job.data.stravaAccountId
                }
            });

            const res = await stravaApiWrapper.getWorkoutsAndStoreInDatabase(stravaAccount, job.data.page, job.data.per_page);
            
        } catch (error) {

            if (error instanceof StravaAuthError) {
                console.log("worker2.stravaActivitySync caught StravaAuthError => TODO how to handle user experience when auth fails");
                console.log(JSON.stringify(error));
                //TODO how to handle user experience when auth fails
            } else if (error instanceof StravaThrottleError){
                //console.log("worker2.stravaActivitySync caught StravaThrottleError");
                //console.log(JSON.stringify(error));
                const delay = await StravaApiThrottler.millisUntilApiAvailable();
                const q = new Queue('stravaActivitySync', { connection: redis_client });
                const parentDetails = {id: job?.parent?.id, queue: job?.parent?.queueKey}
                const newjob = await Job.create(q, "stravaActivitySync", job.data, {parent: parentDetails, delay: delay, removeOnComplete: true});
                console.log("worker2 caught StravaThrottleError=> new DELAYED child newjob.id="+newjob.id+" delay="+delay);
            } else {
                console.log("worker2.stravaActivitySync caught ERROR");
                console.log(JSON.stringify(error));
            }
            
        }
        

        // A job can return values that will be stored in Redis as JSON
        // This return value is unused in this demo application.
        console.log("DONE stravaGetActivity job.id="+job.id);
        return;
    }, { connection: redis_client, concurrency: 50 } );

    worker2.on('error', err => {
        console.error(err);
    });


    const worker3 = new Worker('stravaSubscribeWebhook', async (job) => {
        console.log("STARTING stravaSubscribeWebhook job.id="+job.id+" job.name="+job.name+" job.queueName="+job.queueName);

        try { 
            const stravaApiWrapper = require("./strava-api-wrapper"); 
            const StravaAccount = db.sequelize.models.StravaAccount;
            const stravaAccount = await StravaAccount.findOne({
                where: {
                    id: job.data.stravaAccountId
                }
            });
            const res = await stravaApiWrapper.createWebhookSubscription(stravaAccount);
            console.log("worker3.stravaSubscribeWebhook thinks it created a new subscription!");
            
        } catch (error) {

            if (error instanceof StravaAuthError) {
                console.log("worker3.stravaSubscribeWebhook caught StravaAuthError => TODO how to handle user experience when auth fails");
                console.log(JSON.stringify(error));
                //TODO how to handle user experience when auth fails
            } else if (error instanceof StravaThrottleError){
                //console.log("worker2.stravaGetActivity caught StravaThrottleError");
                //console.log(JSON.stringify(error));
                const delay = await StravaApiThrottler.millisUntilApiAvailable();
                const q = new Queue('stravaSubscribeWebhook', { connection: redis_client });
                const newjob = await Job.create(q, "stravaSubscribeWebhook", job.data, {delay: delay, removeOnComplete: true});
                console.log("worker3 caught StravaThrottleError=> new DELAYED child newjob.id="+newjob.id+" delay="+delay);
            } else {
                console.log("worker3.stravaSubscribeWebhook caught ERROR");
                console.error(error);
            }
            
        }

        console.log("DONE stravaSubscribeWebhook job.id="+job.id);
        return;
    }, { connection: redis_client, concurrency: 50 } );

    worker3.on('error', err => {
        console.error(err);
    });


    const worker4 = new Worker('stravaGetSingleActivity', async (job) => {
        console.log("STARTING stravaGetSingleActivity job.id="+job.id+" job.name="+job.name+" job.queueName="+job.queueName);

        try { 
            const stravaApiWrapper = require("./strava-api-getSingleActivity"); 
            const StravaAccount = db.sequelize.models.StravaAccount;
            const stravaAccount = await StravaAccount.findOne({
                where: {
                    id: job.data.stravaAccountId
                }
            });
            const res = await stravaApiWrapper.getSingleActivity(stravaAccount, job.data.activity_id);
            console.log("worker.stravaGetSingleActivity thinks it got a single activity!");
        
        } catch (error) {

            if (error instanceof StravaAuthError) {
                console.log("worker3.stravaGetSingleActivity caught StravaAuthError => TODO how to handle user experience when auth fails");
                console.log(JSON.stringify(error));
                //TODO how to handle user experience when auth fails
            } else if (error instanceof StravaThrottleError){
                //console.log("worker2.stravaGetSingleActivity caught StravaThrottleError");
                //console.log(JSON.stringify(error));
                const delay = await StravaApiThrottler.millisUntilApiAvailable();
                const q = new Queue('stravaGetSingleActivity', { connection: redis_client });
                const newjob = await Job.create(q, "stravaGetSingleActivity", job.data, {delay: delay, removeOnComplete: true});
                console.log("worker3 caught StravaThrottleError=> new DELAYED child newjob.id="+newjob.id+" delay="+delay);
            } else {
                console.log("worker3.stravaGetSingleActivity caught ERROR");
                console.error(error);
            }
            
        }

        console.log("DONE stravaGetSingleActivity job.id="+job.id);
        return;
    }, { connection: redis_client, concurrency: 10 } );

    worker4.on('error', err => {
        console.log("ERROR in strava-worker-getSingleActivity");
        console.error(err);
    });

}


//TODO this *may* be firing up two workers, each with 50 concurrency, not sure
console.log("strava-worker.js will call startStravaWorkers()");
startStravaWorkers();

// Initialize the clustered worker process
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
// const start = require('./worker.js');
//const workers = 2;
//throng({ workers, startStravaWorkers });