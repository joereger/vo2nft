//let throng = require('throng');
const { Worker, Job, Queue, QueueScheduler } = require('bullmq');
let redis_client = require('../config/redis-client.js');
const db = require('../models/index.js');
const StravaThrottleError = require('./strava-error-throttle.js');
const StravaAuthError = require('./strava-error-auth.js');
const StravaApiThrottler = require('./strava-api-throttler.js');

var startStravaWorkers = exports.startStravaWorkers = () => {
    console.log("strava-worker.js startStravaWorkers called");

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
            console.log("worker3.stravaGetSingleActivity thinks it got a single activity!");
        
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
    }, { connection: redis_client, concurrency: 50 } );

    worker.on('error', err => {
        console.error(err);
    });

}

//console.log("strava-worker.js will call startStravaWorkers()");
//startStravaWorkers();

// Initialize the clustered worker process
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
// const start = require('./worker.js');
//const workers = 2;
//throng({ workers, startStravaWorkers });