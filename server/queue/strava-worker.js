//let throng = require('throng');
const { Worker } = require('bullmq');
let redis_client = require('../config/redis-client.js'); 

var startStravaWorkers = exports.startStravaWorkers = () => {
    console.log("strava-worker.js startStravaWorkers called");

    const worker = new Worker('primaryQueue', async (job) => {
        //console.log("START job.id="+job.id+" job.name="+job.name+" job.queueName="+job.queueName);
        try { 
            if (job.name === 'stravaActivitySync'){
                await require('./strava-job-activitySync').work(job);
            } else if (job.name === 'stravaActivitySyncComplete'){
                await require('./strava-job-activitySync').workComplete(job);
            } else if (job.name === 'stravaGetSingleActivity'){
                await require('./strava-job-getSingleActivity').work(job);
            } else if (job.name === 'stravaSubscribeWebhook'){
                await require('./strava-job-subscribeWebhook').work(job);
            } else if (job.name === 'getGoogleMapSaveToS3'){
                await require('./strava-job-getGoogleMapSaveToS3').work(job);
            } else {
                console.error("strava-worker.js unknown job name="+job.name);
            }
        } catch (err) {
            console.log("strava-worker error");
            console.error(err);
        }
        //console.log("END job.id="+job.id+" job.name="+job.name+" job.queueName="+job.queueName);
        return;
    }, { connection: redis_client, concurrency: 50 } );

    worker.on('error', err => {
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