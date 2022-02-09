const { QueueScheduler, Queue } = require('bullmq');
let redis_client = require('../config/redis-client.js');

exports.enqueue = async (stravaAccount, activity_id) => {
    console.log("strava-enqueuer-getSingleActivity.js enqueue() called");
    const workQueue = new Queue('stravaGetSingleActivity', { connection: redis_client });
    const qs = new QueueScheduler('stravaGetSingleActivity', { connection: redis_client });
    let job = workQueue.add('stravaGetSingleActivity', { stravaAccountId: stravaAccount.id, activity_id: activity_id }).then((job) => {
        console.log("stravaGetSingleActivity ADDED job.id="+job.id+" to queue");
    }).catch((error) => {
        console.error(error);
    });
}