const { Job, Queue } = require('bullmq');
let redis_client = require('../config/redis-client.js');
const db = require('../models/index.js');
const StravaThrottleError = require('./strava-error-throttle.js');
const StravaAuthError = require('./strava-error-auth.js');
const StravaApiThrottler = require('./strava-api-throttler.js');

exports.enqueue = async (stravaAccount, activity_id) => {
    console.log("strava-enqueuer-getSingleActivity.js enqueue() called");
    const workQueue = new Queue('primaryQueue', { connection: redis_client });
    const qs = new QueueScheduler('primaryQueue', { connection: redis_client });
    let job = workQueue.add('stravaGetSingleActivity', { stravaAccountId: stravaAccount.id, activity_id: activity_id }).then((job) => {
        console.log("stravaGetSingleActivity ADDED job.id="+job.id+" to queue");
    }).catch((error) => {
        console.error(error);
    });
}

exports.work = async (job) => {
        console.log("START stravaGetSingleActivity job.id="+job.id+" job.name="+job.name+" job.queueName="+job.queueName);

        try { 
            const stravaApiWrapper = require("./strava-api-getSingleActivity"); 
            const StravaAccount = db.sequelize.models.StravaAccount;
            const stravaAccount = await StravaAccount.findOne({
                where: {
                    id: job.data.stravaAccountId
                }
            });
            const res = await stravaApiWrapper.getSingleActivity(stravaAccount, job.data.activity_id);
            console.log("stravaGetSingleActivity thinks it got a single activity!");
        
        } catch (error) {

            if (error instanceof StravaAuthError) {
                console.log("stravaGetSingleActivity caught StravaAuthError => TODO how to handle user experience when auth fails");
                console.log(JSON.stringify(error));
                //TODO how to handle user experience when auth fails
            } else if (error instanceof StravaThrottleError){
                //console.log("stravaGetSingleActivity caught StravaThrottleError");
                //console.log(JSON.stringify(error));
                const delay = await StravaApiThrottler.millisUntilApiAvailable();
                const q = new Queue('stravaGetSingleActivity', { connection: redis_client });
                const newjob = await Job.create(q, "stravaGetSingleActivity", job.data, {delay: delay, removeOnComplete: true});
                console.log("wstravaGetSingleActivity caught StravaThrottleError=> new DELAYED child newjob.id="+newjob.id+" delay="+delay);
            } else {
                console.log("wstravaGetSingleActivity caught ERROR");
                console.error(error);
            }
            
        }

        console.log("END stravaGetSingleActivity job.id="+job.id+" job.name="+job.name+" job.queueName="+job.queueName);
        return;
}