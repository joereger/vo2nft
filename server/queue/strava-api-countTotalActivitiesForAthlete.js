const { DateTime } = require('luxon');
const axios = require('axios');
const FormData = require('form-data');
const strava_throttler = require("./strava-api-throttler");
const db = require('../models/index.js');
const StravaThrottleError = require('./strava-error-throttle.js');
const StravaAuthError = require('./strava-error-auth.js');
 
exports.countTotalActivitiesForAthlete = async (stravaAccount) => {
    //console.log("countTotalActivitiesForAthlete called");
    try{

        //Verify the auth token or refresh it
        try{
            stravaAccount = await require('./strava-api-verifyAuthReturnStravaAccountICanUse.js').verifyAuthReturnStravaAccountICanUse(stravaAccount);
            //console.log("getWorkoutsAndStoreInDatabase stravaAccount.auth_token="+stravaAccount.auth_token);
        } catch (error){
            if (error instanceof StravaAuthError) {
                throw error;
            } else if (error instanceof StravaThrottleError){
                throw error;
            }
        }

        //Check to make sure i can make the api call
        if (!(await strava_throttler.canICallApiNow())){
            throw new StravaThrottleError();
        }
        
        //Record the API call
        strava_throttler.recordApiCall();

        //Get athlete details
        let strava_data = null;
        try{ 

            let response2 = await axios.get('https://www.strava.com/api/v3/athletes/'+stravaAccount.athlete_id+'/stats', 
                { headers: {Authorization: 'Bearer ' + stravaAccount.auth_token} }
            );

            strava_data = response2.data;

            let totalActivities = 0;
            if (strava_data?.all_run_totals?.count){
                totalActivities = totalActivities + strava_data?.all_run_totals.count;
            }
            if (strava_data?.all_swim_totals?.count){
                totalActivities = totalActivities + strava_data?.all_swim_totals.count;
            }
            if (strava_data?.all_ride_totals?.count){
                totalActivities = totalActivities + strava_data?.all_ride_totals.count;
            }
            return totalActivities;

        } catch (error) {
            console.log("/strava-api-countTotalActivitiesForAthlete returning ERROR #2");
            // console.log("AXIOS ERROR START");
            //console.log(error); 
            // console.log("AXIOS ERROR END");
            throw new StravaAuthError("/strava-api-countTotalActivitiesForAthlete returning ERROR #2");
        }

    } catch (error) {
        console.log("/strava-api-countTotalActivitiesForAthlete returning ERROR #1");
        //console.log(error);
        throw error;
    }
    
}
