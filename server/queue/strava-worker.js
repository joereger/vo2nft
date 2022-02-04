//let throng = require('throng');
const { Worker } = require('bullmq');
const Redis = require('ioredis');
let redis_client = new Redis(process.env.REDIS_URL, {maxRetriesPerRequest: null, enableReadyCheck: false} );
const db = require('../models/index.js');
const StravaThrottleError = require('./strava-errors.js');
const StravaAuthError = require('./strava-errors.js');

var startStravaWorkers = exports.startStravaWorkers = () => {
    console.log("strava-worker.js startStravaWorkers called");

    const worker = new Worker('stravaActivitySyncComplete', async (job) => {
        console.log("STARTING stravaActivitySyncComplete job.id="+job.id+" job.name="+job.name+" job.queueName="+job.queueName);

        try { 
            const StravaAccount = db.sequelize.models.StravaAccount;
            StravaAccount.findOne({
                where: {
                    id: job.data.stravaAccountId
                }
            }).then(
                stravaAccountLive => {
                    //console.log("strava-worker stravaAccountLive.id="+stravaAccountLive?.id);
                    stravaAccountLive.is_syncing = false;
                    stravaAccountLive.save().then(()=>{
                        //console.log("stravaAccountLive.save() called setting IS_SYNCING=false");   
                    });
                },
                err => next(err)
            )
        } catch (err) {
            console.log("stravaActivitySyncComplete error #2");
            console.log(err);
            res.statusCode = 401
            res.send("FAIL DERP")
        }

        console.log("DONE DONE DONE stravaActivitySyncComplete job.id="+job.id);
        return '' ;
    }, { connection: redis_client, concurrency: 50 } );

    worker.on('error', err => {
        console.error(err);
    });


    const worker2 = new Worker('stravaGetActivity', async (job) => {
        console.log("STARTING stravaGetActivity job.id="+job.id+" job.name="+job.name+" job.queueName="+job.queueName+" job.data.page="+job.data.page+" job.data.per_page="+job.data.per_page);


        //TODO i need a way to handle the throttling here
        try{
            const stravaApiWrapper = require("./strava-api-wrapper"); 

            const StravaAccount = db.sequelize.models.StravaAccount;
            const stravaAccount = await StravaAccount.findOne({
                where: {
                    id: job.data.stravaAccountId
                }
            });
            console.log("strava-worker.js TOP stravaAccountId="+stravaAccount.id);

            const res = await stravaApiWrapper.getWorkoutsAndStoreInDatabase(stravaAccount, job.data.page, job.data.per_page);
            console.log("strava-worker.js under await stravaApiWrapper.getWorkoutsAndStoreInDatabase()");  

        } catch (error) {

            if (error instanceof StravaAuthError) {
                console.log("stravaGetActivity caught StravaAuthError");
                console.log(error.message);
            } else if (error instanceof StravaThrottleError){
                console.log("stravaGetActivity caught StravaThrottleError");
                console.log(error.message);
            } else {
                console.log("stravaGetActivity caught ERROR");
                console.log(error.message);
            }
            
        }
        

        // A job can return values that will be stored in Redis as JSON
        // This return value is unused in this demo application.
        console.log("DONE stravaGetActivity job.id="+job.id);
        return '';
    }, { connection: redis_client, concurrency: 50 } );

    worker2.on('error', err => {
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