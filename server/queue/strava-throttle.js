const { Queue, FlowProducer } = require('bullmq');
const Redis = require('ioredis');
let redis = new Redis(process.env.REDIS_URL);
import { format, compareAsc } from 'date-fns'

const currentDailyApiLimit = 1000;
const currentFifteenMinuteApiLimit = 100;

exports.recordApiCall = () => {
    console.log("strava-throttle.js recordApiCall() called");

    //Key for date + 1/4 hour chunks, set to expire at next 1/4 hour chunk
    var fifteenMinKey = '';
    var fifteenMinExpireAt = '';

    redis
    .multi()
    .incr(fifteenMinKey)
    .expire(fifteenMinKey, fifteenMinExpireAt)
    .exec((err, results) => {
        // results === [[null, 'OK'], [null, 'bar']]
        console.log("ERROR setting redis fifteenMinKey");
    });

    //Key for date (as defined at UTC), set to expire at midnight
    var dailyKey = '';
    var dailyExpireAt = '';

    redis
    .multi()
    .incr(dailyKey)
    .expire(dailyKey, dailyExpireAt)
    .exec((err, results) => {
        // results === [[null, 'OK'], [null, 'bar']]
        console.log("ERROR setting redis dailyKey");
    });

}

//15 minute chunks start at 0 minutes in hour
exports.apiCallsCurrentFifteenMinuteBlock = () => {

}

//1 day chunk starts at midnight UTC
exports.apiCallsToday = () => {

}

exports.canICallApiNow = () => {
    

}

exports.whenCanICallApi = () => {

}

