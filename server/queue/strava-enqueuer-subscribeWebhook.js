const { QueueScheduler, FlowProducer, Queue } = require('bullmq');
let redis_client = require('../config/redis-client.js');
const StravaThrottleError = require('./strava-error-throttle.js');
const StravaAuthError = require('./strava-error-auth.js');

exports.enqueue = async (stravaAccount) => {
    console.log("strava-enqueuer-subscribeWebhook.js enqueue() called");
    const workQueue = new Queue('primaryQueue', { connection: redis_client });
    const qs = new QueueScheduler('primaryQueue', { connection: redis_client });
    let job = workQueue.add('stravaSubscribeWebhook', { stravaAccountId: stravaAccount.id }).then((job) => {
        console.log("subscribeWebhook ADDED job.id="+job.id+" to queue");
    }).catch((error) => {
        console.error(error);
    });
}