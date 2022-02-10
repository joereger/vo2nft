//let throng = require('throng');

//var startStravaWorkers = exports.startStravaWorkers = () => {
exports.startStravaWorkers = () => {
    console.log("strava-worker-starter.js called");

    const w1 = require("./strava-worker-activitySync");
    const w2 = require("./strava-worker-getSingleActivity");
    const w3 = require("./strava-worker-subscribeWebhook");

}

//TODO this *may* be firing up two workers, each with 50 concurrency, not sure
//console.log("strava-worker-starter.js will call startStravaWorkers() on all the different workers");
//startStravaWorkers();

// Initialize the clustered worker process
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
// const start = require('./worker.js');
//const workers = 2;
//throng({ workers, startStravaWorkers });