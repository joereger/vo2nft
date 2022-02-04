const { Queue, FlowProducer } = require('bullmq');
const Redis = require('ioredis');
let redis_client = new Redis(process.env.REDIS_URL, {maxRetriesPerRequest: null, enableReadyCheck: false});

exports.stravaActivitySync = async (stravaAccount) => {
    console.log("strava-enqueuer.js stravaActivitySync() called stravaAccount.id="+stravaAccount.id);   
    
    const flowProducer = new FlowProducer({ connection: redis_client });

    //Don't re-enque the same account
    if (stravaAccount.is_syncing){
        return;
    }

    //Figure out how many activities need to be harvested
    const str = require("./strava-api-wrapper"); 
    var totalActivities = await str.countTotalActivitiesForAthlete(stravaAccount);
    console.log("strava-enqueuer.js totalActivities="+totalActivities);

    

    //{ name: 'stravaGetActivity', queueName: 'stravaGetActivity', data: { stravaId: 'dsfsd', userId: 2, accessToken: 'fsdsdf' } }
    var childrenToGet = [];
    var activitiesQueued = 0;
    var page = 1;
    var per_page = 200;

    //TODO remove this override
    totalActivities = 10;
    per_page = 10;

    while (activitiesQueued<totalActivities){
        childrenToGet.push({ name: 'stravaGetActivity', queueName: 'stravaGetActivity', data: { stravaAccountId: stravaAccount.id, page: page, per_page: per_page } });
        page = page + 1;
        activitiesQueued = activitiesQueued + per_page;
    }
    
    //console.log("childrenToGet="+JSON.stringify(childrenToGet));

    const flow = flowProducer.add({
        name: 'stravaActivitySyncComplete',
        queueName: 'stravaActivitySyncComplete',
        data: {stravaAccountId: stravaAccount.id},
        children: childrenToGet,
    });

}