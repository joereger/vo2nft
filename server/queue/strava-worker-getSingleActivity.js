//let throng = require('throng');
const { Worker, Job, Queue } = require('bullmq');
let redis_client = require('../config/redis-client.js');
const db = require('../models/index.js');
const StravaThrottleError = require('./strava-error-throttle.js');
const StravaAuthError = require('./strava-error-auth.js');
const StravaApiThrottler = require('./strava-api-throttler.js');

var startStravaWorkers = exports.startStravaWorkers = () => {
    console.log("strava-worker-getSingleActivity.js startStravaWorkers called");

    const worker = new Worker('stravaGetSingleActivity', async (job) => {
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

    worker.on('error', err => {
        console.log("ERROR in strava-worker-getSingleActivity");
        console.error(err);
    });

    //===========================

    const worker2 = new Worker('stravaSubscribeWebhook', async (job) => {
        console.log("STARTING stravaSubscribeWebhook job.id="+job.id+" job.name="+job.name+" job.queueName="+job.queueName);

        try { 
            const stravaApiWrapper = require("./strava-api-subscribeWebhook"); 
            const StravaAccount = db.sequelize.models.StravaAccount;
            const stravaAccount = await StravaAccount.findOne({
                where: {
                    id: job.data.stravaAccountId
                }
            });
            const res = await stravaApiWrapper.subscribeWebhook(stravaAccount);
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
    }, { connection: redis_client, concurrency: 10 } );

    worker2.on('error', err => {
        console.log("ERROR in strava-worker-subscribeWebhook");
        console.error(err);
    });

    //===========================

}

//console.log("strava-worker.js will call startStravaWorkers()");
startStravaWorkers();

// Initialize the clustered worker process
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
// const start = require('./worker.js');
//const workers = 2;
//throng({ workers, startStravaWorkers });