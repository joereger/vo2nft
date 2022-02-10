//let throng = require('throng');
const { Worker, Job, Queue } = require('bullmq');
let redis_client = require('../config/redis-client.js');
const db = require('../models/index.js');
const StravaThrottleError = require('./strava-error-throttle.js');
const StravaAuthError = require('./strava-error-auth.js');
const StravaApiThrottler = require('./strava-api-throttler.js');

var startStravaWorkers = exports.startStravaWorkers = () => {
    console.log("strava-worker-activitySync.js startStravaWorkers called");

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
    }, { connection: redis_client, concurrency: 10 } );

    worker.on('error', err => {
        console.log("ERROR in strava-worker-activitySync worker");
        console.error(err);
    });


    const worker2 = new Worker('stravaActivitySync', async (job) => {
        console.log("STARTING stravaActivitySync job.id="+job.id+" job.name="+job.name+" job.queueName="+job.queueName+" job.data.page="+job.data.page+" job.data.per_page="+job.data.per_page);
        //console.log("STARTING stravaActivitySync parentKey="+job?.parentKey);   
        //console.log("STARTING stravaActivitySync parent="+JSON.stringify(job?.parent));
    

        try{

            const stravaApiWrapper = require("./strava-api-getWorkoutsAndStoreInDatabase"); 
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
        console.log("DONE stravaActivitySync job.id="+job.id);
        return;
    }, { connection: redis_client, concurrency: 10 } );

    worker2.on('error', err => {
        console.log("ERROR in strava-worker-activitySync worker 2");
        console.error(err);
    });

}


//console.log("strava-worker-activitySync.js will call startStravaWorkers()");
startStravaWorkers();

// Initialize the clustered worker process
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
// const start = require('./worker.js');
//const workers = 2;
//throng({ workers, startStravaWorkers });