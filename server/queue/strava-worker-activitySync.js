const { Job, Queue } = require('bullmq');
let redis_client = require('../config/redis-client.js');
const db = require('../models/index.js');
const StravaThrottleError = require('./strava-error-throttle.js');
const StravaAuthError = require('./strava-error-auth.js');
const StravaApiThrottler = require('./strava-api-throttler.js');



exports.stravaActivitySync = async (job) => {
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


exports.stravaActivitySyncComplete = async (job) => {
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