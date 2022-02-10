const { Job, Queue } = require('bullmq');
let redis_client = require('../config/redis-client.js');
const db = require('../models/index.js');
const StravaThrottleError = require('./strava-error-throttle.js');
const StravaAuthError = require('./strava-error-auth.js');
const StravaApiThrottler = require('./strava-api-throttler.js');

exports.stravaSubscribeWebhook = async (job) => {
        console.log("START stravaSubscribeWebhook job.id="+job.id+" job.name="+job.name+" job.queueName="+job.queueName);

        try { 
            const stravaApiWrapper = require("./strava-api-subscribeWebhook"); 
            const StravaAccount = db.sequelize.models.StravaAccount;
            const stravaAccount = await StravaAccount.findOne({
                where: {
                    id: job.data.stravaAccountId
                }
            });
            const res = await stravaApiWrapper.subscribeWebhook(stravaAccount);
            console.log("stravaSubscribeWebhook thinks it created a new subscription!");
            
        } catch (error) {

            if (error instanceof StravaAuthError) {
                console.log("stravaSubscribeWebhook caught StravaAuthError => TODO how to handle user experience when auth fails");
                console.log(JSON.stringify(error));
                //TODO how to handle user experience when auth fails
            } else if (error instanceof StravaThrottleError){
                //console.log("stravaSubscribeWebhook caught StravaThrottleError");
                //console.log(JSON.stringify(error));
                const delay = await StravaApiThrottler.millisUntilApiAvailable();
                const q = new Queue('stravaSubscribeWebhook', { connection: redis_client });
                const newjob = await Job.create(q, "stravaSubscribeWebhook", job.data, {delay: delay, removeOnComplete: true});
                console.log("stravaSubscribeWebhook caught StravaThrottleError=> new DELAYED child newjob.id="+newjob.id+" delay="+delay);
            } else {
                console.log("stravaSubscribeWebhook caught ERROR");
                console.error(error);
            }
            
        }

        console.log("END stravaSubscribeWebhook job.id="+job.id+" job.name="+job.name+" job.queueName="+job.queueName);
        return;
}