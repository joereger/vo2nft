const { DateTime } = require('luxon');
const axios = require('axios');
const FormData = require('form-data');
const strava_throttler = require("./strava-api-throttler");
const db = require('../models/index.js');
const StravaThrottleError = require('./strava-error-throttle.js');
const StravaAuthError = require('./strava-error-auth.js');
   

exports.getWorkoutsAndStoreInDatabase = async (stravaAccount, page, per_page=200) => {
    console.log("getWorkoutsAndStoreInDatabase called");
    try{

        //Verify the auth token or refresh it
        try{
            stravaAccount = await require('./strava-api-verifyAuthReturnStravaAccountICanUse.js').verifyAuthReturnStravaAccountICanUse(stravaAccount);
            //console.log("getWorkoutsAndStoreInDatabase stravaAccount.auth_token="+stravaAccount.auth_token);
        } catch (error){
            if (error instanceof StravaAuthError) {
                //console.log("getWorkoutsAndStoreInDatabase passing StravaAuthError up the chain");
                throw error;
            } else if (error instanceof StravaThrottleError){
                //console.log("getWorkoutsAndStoreInDatabase passing StravaThrottleError up the chain");
                throw error;
            }
        }

        //Check to make sure i can make the api call
        if (!(await strava_throttler.canICallApiNow())){
            //console.log("getWorkoutsAndStoreInDatabase creating StravaThrottleError");
            throw new StravaThrottleError("getWorkoutsAndStoreInDatabase creating StravaThrottleError");
        }
        
        //Record the API call
        strava_throttler.recordApiCall();

        let response = await axios.get('https://www.strava.com/api/v3/athlete/activities?page='+page+'&per_page='+per_page, 
            { headers: {Authorization: 'Bearer ' + stravaAccount.auth_token} }
        );

        if (response && response.data){

            //Iterate workouts
            response.data.forEach(function(workout) { 
                //console.log("workout.id="+workout.id); 

                const Workout = db.sequelize.models.Workout;

                //Have to make sure we don't insert dupes
                Workout.findOne({ where: {
                    workout_id: workout?.id,
                    external_account_id: stravaAccount.id   
                } })
                .then(function(workoutDb) {
                    
                    if(workoutDb){
                        //Update existing
                        workoutDb.external_account_type = 'strava';
                        workoutDb.workout_date = workout?.start_date;
                        workoutDb.title = workout?.name;
                        workoutDb.url = 'https://www.strava.com/activities/'+workout?.id;
                        workoutDb.strava_details = workout;
                        workoutDb.save().then((workoutDb) =>{
                            if (workoutDb){
                                //console.log("workout UPDATED workoutDb.id="+workoutDb.id+"in DB");
                                //Enqueue Google Maps image
                                require('./strava-job-getGoogleMapSaveToS3').enqueue(stravaAccount, workoutDb.id);
                            }
                        })
                    } else {
                        //Insert new
                        Workout.create({ 
                            userid_creator: stravaAccount.userId,
                            userid_currentowner: stravaAccount.userId,
                            external_account_type: 'strava',
                            external_account_id: stravaAccount.id,
                            workout_date: workout?.start_date,
                            workout_id: workout?.id,
                            title: workout?.name,
                            url: 'https://www.strava.com/activities/'+workout?.id,
                            strava_details: workout
                        }).then(
                            workoutNew => {
                                if (workoutNew) {
                                    //console.log("workout CREATED workoutNew.id="+workoutNew.id+"in DB");
                                    //Enqueue Google Maps image
                                    require('./strava-job-getGoogleMapSaveToS3').enqueue(stravaAccount, workoutNew.id);
                                }
                            }
                        )
                    }
   
                })

            });
            
        } 
        
    } catch (error) {
        console.log("/strava-api-getWorkoutsAndStoreInDatabase returning ERROR #1");
        console.log(JSON.stringify(error));
        throw error;
    }
    
}

