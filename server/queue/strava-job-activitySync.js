const { Job, Queue, QueueScheduler, FlowProducer } = require('bullmq');
let redis_client = require('../config/redis-client.js');
const db = require('../models/index.js');
const StravaThrottleError = require('./strava-error-throttle.js');
const StravaAuthError = require('./strava-error-auth.js');
const StravaApiThrottler = require('./strava-api-throttler.js');


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


exports.work = async (job) => {
        console.log("START stravaActivitySync job.id="+job.id+" job.name="+job.name+" job.queueName="+job.queueName);
        //console.log("STARTING stravaActivitySync parentKey="+job?.parentKey);   
        //console.log("STARTING stravaActivitySync parent="+JSON.stringify(job?.parent));
    
        try{
            const stravaApiWrapper = require("./strava-api-getWorkoutsAndStoreInDatabase"); 
            const StravaAccount = db.sequelize.models.StravaAccount;
            const stravaAccount = await StravaAccount.findOne({
                where: {
                    id: job.data.stravaAccountId
                }
            });

            const res = await stravaApiWrapper.getWorkoutsAndStoreInDatabase(stravaAccount, job.data.page, job.data.per_page);
            
        } catch (error) {
            if (error instanceof StravaAuthError) {
                console.log("stravaActivitySync caught StravaAuthError => TODO how to handle user experience when auth fails");
                console.log(JSON.stringify(error));
                //TODO how to handle user experience when auth fails
            } else if (error instanceof StravaThrottleError){
                //console.log("stravaActivitySync caught StravaThrottleError");
                //console.log(JSON.stringify(error));
                const delay = await StravaApiThrottler.millisUntilApiAvailable();
                const q = new Queue('stravaActivitySync', { connection: redis_client });
                const parentDetails = {id: job?.parent?.id, queue: job?.parent?.queueKey}
                const newjob = await Job.create(q, "stravaActivitySync", job.data, {parent: parentDetails, delay: delay, removeOnComplete: true});
                console.log("stravaActivitySync caught StravaThrottleError=> new DELAYED child newjob.id="+newjob.id+" delay="+delay);
            } else {
                console.log("stravaActivitySync caught ERROR");
                console.log(JSON.stringify(error));
            }
        }
        
        console.log("END stravaActivitySync job.id="+job.id+" job.name="+job.name+" job.queueName="+job.queueName);
        return;
}


exports.workComplete = async (job) => {
    console.log("START stravaActivitySyncComplete job.id="+job.id+" job.name="+job.name+" job.queueName="+job.queueName);

    try { 
        const StravaAccount = db.sequelize.models.StravaAccount;
        StravaAccount.findOne({
            where: {
                id: job.data.stravaAccountId
            }
        }).then(
            stravaAccountLive => {
                //console.log("stravaActivitySyncComplete stravaAccountLive.id="+stravaAccountLive?.id);
                stravaAccountLive.is_syncing = false;
                stravaAccountLive.save().then(()=>{
                    //console.log("stravaActivitySyncComplete stravaAccountLive.save() called setting IS_SYNCING=false");   
                });
            },
            err => next(err)
        )
    } catch (err) {
        console.log("stravaActivitySyncComplete error #2");
        console.log(err);
    }

    console.log("END stravaActivitySyncComplete job.id="+job.id+" job.name="+job.name+" job.queueName="+job.queueName);
    return;
}