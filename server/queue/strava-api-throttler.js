let redis_client = require('../config/redis-client.js');
const { DateTime } = require('luxon');

//Strava rate limiter based on spec at: https://developers.strava.com/docs/rate-limits/
//
//Strava API usage is limited on a per-application basis using both a 15-minute and daily request limit. 
//The default rate limit allows 100 requests every 15 minutes, with up to 1,000 requests per day. 
//As an application grows, its rate limit may need to be adjusted.
//
//An application’s 15-minute limit is reset at natural 15-minute intervals corresponding to 
//0, 15, 30 and 45 minutes after the hour. The daily limit resets at midnight UTC. 
//Requests exceeding the limit will return 429 Too Many Requests along with a JSON error message. 
//
//Note that requests violating the short term limit will still count toward the long term limit.

const currentDailyApiLimit = 1000; //Strava default is 1000
const currentFifteenMinuteApiLimit = 100; //Strava default is 100
const dailyKeyPrefix = "strava_throttle:daily-";
const fifteenMinKeyPrefix = "strava_throttle:fifteen-mins-";

//This needs to be called before every strava api call
exports.recordApiCall = () => {

    //There are four 15 minute buckets per hour
    const fifteenMinKey = fifteenMinKeyPrefix+whichFifteenMinBucket();
    const fifteenMinExpireAt = DateTime.now().toUTC().plus({ minutes: minutesToAddToGetToEndOfFifteenMinBucket() }).endOf("minute");
    const millisUntilFifteenExpiration = fifteenMinExpireAt.diff(DateTime.now().toUTC()).milliseconds;

    redis_client
    .multi()
    .incr(fifteenMinKey)
    .pexpire(fifteenMinKey, millisUntilFifteenExpiration)
    .exec((err, results) => {
        // results === [[null, 'OK'], [null, 'bar']]
        if (err){
            console.log("ERROR setting redis_client fifteenMinKey err ="+JSON.stringify(err));
        }
    });

    //Key for date (as defined at UTC), set to expire at midnight
    const dayOfYearUtc = DateTime.now().toUTC().day;
    const endOfDayUtc = DateTime.now().toUTC().endOf("day");
    const dailyKey = dailyKeyPrefix+dayOfYearUtc
    const millisUntilDailyExpiration = endOfDayUtc.diff(DateTime.now().toUTC()).milliseconds;

    redis_client
    .multi()
    .incr(dailyKey)
    .pexpire(dailyKey, millisUntilDailyExpiration)
    .exec((err, results) => {
        // results === [[null, 'OK'], [null, 'bar']]
        if (err){
            console.log("ERROR setting redis_client dailyKey err ="+JSON.stringify(err));
        }
    });

}

//15 minute chunks start at 0 minutes in hour
exports.apiCallsSoFarInCurrentFifteenMinuteBlock = async () => {
    const fifteenMinKey = fifteenMinKeyPrefix+whichFifteenMinBucket();
    return await redis_client.get(fifteenMinKey).then(function (result) {
        return result;
    });
}

//1 day chunk starts at midnight UTC
exports.apiCallsSoFarToday = async () => {
    const dayOfYearUtc = DateTime.now().toUTC().day;
    const dailyKey = dailyKeyPrefix+dayOfYearUtc
    return await redis_client.get(dailyKey).then(function (result) {
        return result;
    });
}

exports.apiCallsRemainingToday = async () => {
    const apiCallsSoFarToday = await this.apiCallsSoFarToday();
    return currentDailyApiLimit - apiCallsSoFarToday;
}

exports.apiCallsRemainingThisFifteenMinutes = async () => {
    const apiCallsRemainingThisFifteenMinutes = await this.apiCallsSoFarInCurrentFifteenMinuteBlock();
    return currentFifteenMinuteApiLimit - apiCallsRemainingThisFifteenMinutes;
}

exports.canICallApiNow = async () => {
    const apiCallsSoFarInCurrentFifteenMinuteBlock = await this.apiCallsSoFarInCurrentFifteenMinuteBlock();
    if (apiCallsSoFarInCurrentFifteenMinuteBlock >= currentFifteenMinuteApiLimit){
        return false;
    } 

    const apiCallsSoFarToday = await this.apiCallsSoFarToday(); 
    if (apiCallsSoFarToday >= currentDailyApiLimit){
        return false;
    } 

    return true;
}

//This is used to calculate delay needed when jobs are added to a queue or retried because of API throttling
exports.millisUntilApiAvailable = async () => {

    //Check daily first, if we're at a daily limit punt until tomorrow
    const apiCallsSoFarToday = await this.apiCallsSoFarToday(); 
    if (apiCallsSoFarToday >= currentDailyApiLimit){
        //Delay
        const endOfDayUtc = DateTime.now().toUTC().endOf("day");
        const millisUntilDailyExpiration = endOfDayUtc.diff(DateTime.now().toUTC()).milliseconds;
        return millisUntilDailyExpiration;
    }  

    //We now know that we have more calls within the current day period.
    //So let's check the 15 minute limit.
    const apiCallsSoFarInCurrentFifteenMinuteBlock = await this.apiCallsSoFarInCurrentFifteenMinuteBlock();
    if (apiCallsSoFarInCurrentFifteenMinuteBlock >= currentFifteenMinuteApiLimit){
        //Delay
        const fifteenMinExpireAt = DateTime.now().toUTC().plus({ minutes: minutesToAddToGetToEndOfFifteenMinBucket() }).endOf("minute");
        const millisUntilFifteenExpiration = fifteenMinExpireAt.diff(DateTime.now().toUTC()).milliseconds;
        return millisUntilFifteenExpiration;
    } 

    //Now
    return 0;
}

//Private utility functs below
whichFifteenMinBucket = () => {
    const nowUtc = DateTime.now().toUTC();
    const nowUtcMinute = nowUtc.minute;

    if (nowUtcMinute >=0 && nowUtcMinute <= 14){
        return 1;
    } else if (nowUtcMinute >=15 && nowUtcMinute <= 29){
        return 2;
    } else if (nowUtcMinute >=30 && nowUtcMinute <= 44){
        return 3;
    } else {
        return 4;
    }
}

minutesToAddToGetToEndOfFifteenMinBucket = () => {
    const nowUtc = DateTime.now().toUTC();
    const nowUtcMinute = nowUtc.minute;
    
    if (nowUtcMinute >=0 && nowUtcMinute <= 14){
        return (14 - nowUtcMinute);
    } else if (nowUtcMinute >=15 && nowUtcMinute <= 29){
        return (29 - nowUtcMinute);
    } else if (nowUtcMinute >=30 && nowUtcMinute <= 44){
        return (44 - nowUtcMinute);
    } else {
        return (59 - nowUtcMinute);
    }
}

