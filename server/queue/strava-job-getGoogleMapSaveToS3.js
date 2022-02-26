const { Job, Queue, QueueScheduler } = require('bullmq');
let redis_client = require('../config/redis-client.js');
const db = require('../models/index.js');
const axios = require('axios');
const fs = require('fs');

exports.enqueue = async (stravaAccount, workout_id) => {
    console.log("strava-enqueuer-getGoogleMapSaveToS3.js enqueue() called");
    const workQueue = new Queue('primaryQueue', { connection: redis_client });
    const qs = new QueueScheduler('primaryQueue', { connection: redis_client });
    let job = workQueue.add('getGoogleMapSaveToS3', { stravaAccountId: stravaAccount.id, workout_id: workout_id }).then((job) => {
        console.log("getGoogleMapSaveToS3 ADDED job.id="+job.id+" to queue");
    }).catch((error) => {
        console.error(error);
    });
}

exports.work = async (job) => {
        console.log("START getGoogleMapSaveToS3 job.id="+job.id+" job.name="+job.name+" job.queueName="+job.queueName);

        try { 

            const stravaAccount = await db.sequelize.models.StravaAccount.findOne({
                where: {
                    id: job.data.stravaAccountId
                }
            });

            const workout = await db.sequelize.models.Workout.findOne({
                where: {
                    id: job.data.workout_id
                }
            });

            if (workout && workout.id>0){
                console.log("getGoogleMapSaveToS3 thinks it got a single activity!");
                
                try{
                    if (workout?.strava_details?.map?.summary_polyline){
                        var localFilePath = process.env.GOOGLE_MAPS_LOCAL_TEMP_PATH;
                        var localFileName;
            
                        //Let's go grab the Google Maps image and save it to the file system, shall we?
                        //https://maps.googleapis.com/maps/api/staticmap?key=AIzaSyB59IXLwloEoHPDsfcaySxMZgZgzRmfV8o&size=640x640&path=weight:7%7Ccolor:blue%7Cenc:em_mEfhzaONZHHj@Fz@AP@JB?xFAtAEt@BfCCt@@TEl@@jAEfC@nEEbCBd@QlF@p@j@~DRlBH^@TELWXe@VwDjC\\fCCb@MRO?]VOFa@`@MHa@Dg@Eq@IaEa@}Ca@iD]aAOu@GiASc@MiBu@gBaAeBcB{@aAuB_DUe@KUE[Wg@h@t@|B|DpAdBd@f@bAz@lBhAfAd@dB`@|@D`ATj@@|@TfBR\\J|@JR?h@HpADr@CZDn@NDFRJL@f@?b@ILKh@m@`@QCkADa@OgAXyAh@IdCy@X]@UBCEGAUI}@_@qBQsA?S?{AJkENcTIW@k@Ec@By@?[@O?e@BUCg@BoAAi@@}AAg@?OMAa@BIC{@DQGESQc@
                        //Note: have had issues in some encodings and need to replace \\ with \ as per: https://gis.stackexchange.com/questions/83550/google-maps-decoded-polylines-showing-up-incorrectly
                        var enc_polyline = workout?.strava_details?.map?.summary_polyline;
                        const response = await axios.get('https://maps.googleapis.com/maps/api/staticmap?'+
                        'path=weight:7%7Ccolor:blue%7Cenc:'+enc_polyline+
                        '&key='+process.env.GOOGLE_MAPS_API_KEY+
                        '&size=400x400',  
                            { 
                                responseType: 'stream'
                            }
                        );
                
                        if (response && response.data){
                            console.log("Google Maps Static API responded with an image");
                            //console.log(JSON.stringify(response.config));
                            //console.log(response.headers)
                            //const localFilePath = '/Users/joereger/Downloads/VO2NFT-temp/';
                            localFileName = 'googlemap-workoutid-'+job.data.workout_id+'.png';
                            const w = response.data.pipe(fs.createWriteStream(localFilePath+localFileName));
                            w.on('finish', () => {
                                console.log('Successfully downloaded googlemap to '+localFilePath);

                                //Now let's save to S3, yo
                                try {
                                    require('../util/s3').uploadFile(localFilePath+localFileName, localFileName);
                                } catch (err){
                                    console.error("error s3 upload from google maps download", err);
                                }

                                //Update s3_maps_key on workout
                                workout.s3_maps_key = localFileName;
                                workout.save();                                

                            });

                        }

                    }
            
                } catch (err){
                    console.error(err);
                }

            }
            
        } catch (error) {

            console.log("getGoogleMapSaveToS3 caught ERROR");
            console.error(error);
            
        }

        console.log("END getGoogleMapSaveToS3 job.id="+job.id+" job.name="+job.name+" job.queueName="+job.queueName);
        return;
}