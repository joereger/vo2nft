const { QueueScheduler, FlowProducer, Queue } = require('bullmq');
let redis_client = require('../config/redis-client.js');
const StravaThrottleError = require('./strava-error-throttle.js');
const StravaAuthError = require('./strava-error-auth.js');

exports.enqueue = async (stravaAccount) => {
    console.log("strava-enqueuer-activitySync.js enqueue() called stravaAccount.id="+stravaAccount.id);
    
    const flowProducer = new FlowProducer({ connection: redis_client });

    //This QueueScheduler is created so that jobs can be delayed
    const qs = new QueueScheduler('primaryQueue', { connection: redis_client });

    //Don't re-enque the same account
    if (stravaAccount.is_syncing){
        return;
    }

    //Figure out how many activities need to be harvested
    var totalActivities = 0;
    try{
        const str = require("./strava-api-countTotalActivitiesForAthlete"); 
        totalActivities = await str.countTotalActivitiesForAthlete(stravaAccount);
        //console.log("strava-enqueuer-activitySync.js totalActivities="+totalActivities);
    } catch (error){
        if (error instanceof StravaAuthError) {
            console.log("strava-enquer.stravaActivitySync caught StravaAuthError");
        } else if (error instanceof StravaThrottleError){
            console.log("strava-enquer.stravaActivitySync caught StravaThrottleError");
        } else {
            console.log("strava-enquer.stravaActivitySync caught ERROR");
        }
    }


    //{ name: 'stravaActivitySync', queueName: 'stravaActivitySync', data: { stravaId: 'dsfsd', userId: 2, accessToken: 'fsdsdf' } }
    var childrenToGet = [];
    var activitiesQueued = 0;
    var page = 1;
    var per_page = 200;

    //TODO remove this override
    totalActivities = 10;
    per_page = 10;

    while (activitiesQueued<=totalActivities){
        childrenToGet.push({ name: 'stravaActivitySync', queueName: 'primaryQueue', opts: {removeOnComplete: true}, data: { stravaAccountId: stravaAccount.id, page: page, per_page: per_page } });
        page = page + 1;
        activitiesQueued = activitiesQueued + per_page;
    }
    
    //console.log("childrenToGet="+JSON.stringify(childrenToGet));

    const flow = flowProducer.add({
        name: 'stravaActivitySyncComplete',
        queueName: 'primaryQueue',
        opts: {removeOnComplete: true},
        data: {stravaAccountId: stravaAccount.id},
        children: childrenToGet,
    });

}

