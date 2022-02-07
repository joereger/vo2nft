const { DateTime } = require('luxon');
const axios = require('axios');
const FormData = require('form-data');
const strava_throttler = require("./strava-api-throttler");
const db = require('../models/index.js');
const StravaThrottleError = require('./strava-error-throttle.js');
const StravaAuthError = require('./strava-error-auth.js');
    
//Strava auth handler manages tokens/etc per the docs: https://developers.strava.com/docs/authentication/

//Called before any Strava API calls, this method checks the local token to see if it's expired.
//If expired it'll try to refresh the access token using the refresh token.
exports.verifyAuthReturnStravaAccountICanUse = async (stravaAccount) => {
    console.log("strava-api-wrapper.verifyAuthReturnStravaAccountICanUse called stravaAccount.id="+stravaAccount.id);
    const auth_token_expires_at = stravaAccount.auth_token_expires_at;
    const auth_token_expires_at_luxon = DateTime.fromJSDate(auth_token_expires_at);
    //console.log("auth_token_expires_at="+JSON.stringify(auth_token_expires_at));
    //console.log("auth_token_expires_at_luxon="+auth_token_expires_at_luxon);

    const millisUntilExpiration = auth_token_expires_at_luxon.diff(DateTime.now().toUTC()).milliseconds;
    //console.log("millisUntilExpiration="+millisUntilExpiration);

    //I like calculating the time until expiration because i can gut check with debug statements.
    //A simple date comparison can hide a lot of complexity... timezone shifts, etc.
    if(millisUntilExpiration > 0){
        console.log("strava auth_token NOT EXPIRED -> auth_token_expires_at="+auth_token_expires_at+" DateTime.now().toUTC()="+DateTime.now().toUTC());
        return stravaAccount;
    } else {
        console.log("strava auth_token EXPIRED -> auth_token_expires_at="+auth_token_expires_at+" DateTime.now().toUTC()="+DateTime.now().toUTC());   
        //Ok, here we are, the token has expired, now we need to use the refresh token call to get a new token
        try{
            const out = await this.refreshAuthTokenReturnStravaAccount(stravaAccount)
            return out;
        } catch (error){
            if (error instanceof StravaAuthError) {
                throw error;
            } else if (error instanceof StravaThrottleError){
                throw error;
            }
        }
    }
}

exports.refreshAuthTokenReturnStravaAccount = async (stravaAccount) => {
    //console.log("refreshAuthTokenReturnStravaAccount called");
    try{
        //Record the API call
        strava_throttler.recordApiCall();

        //Build the Strava request to trade an auth code for an access token
        const form_data = new FormData();
        form_data.append('client_id', process.env.STRAVA_CLIENT_ID);
        form_data.append('client_secret', process.env.STRAVA_CLIENT_SECRET);
        form_data.append('grant_type', 'refresh_token');
        form_data.append('refresh_token', stravaAccount.refresh_token);

        let response = null;
        try{
            response = await axios.post('https://www.strava.com/api/v3/oauth/token', 
                form_data, 
                { headers: form_data.getHeaders() }
            );
        } catch (error){
            throw new StravaAuthError("refreshAuthTokenReturnStravaAccount at Axios call to Strava");
        }
        

        let data = response.data;
        console.log(data);
        // console.log("data.token_type="+data.token_type);
        // console.log("data.expires_at="+data.expires_at);
        // console.log("data.expires_in="+data.expires_in);
        // console.log("data.refresh_token="+data.refresh_token);
        // console.log("data.access_token="+data.access_token);
        const auth_token_expires_at = DateTime.fromSeconds(data.expires_at).toUTC();

        //Save the stravaAccount with updated tokens
        try{
            stravaAccount.auth_token = data.access_token;
            stravaAccount.refresh_token = data.refresh_token;
            stravaAccount.auth_token_expires_at = auth_token_expires_at;
            await stravaAccount.save();
            //console.log("stravaAccount saved stravaAccount.id="+stravaAccount.id);
            return stravaAccount;
            // stravaAccount.save().then(() => {
            //     console.log("stravaAccount saved stravaAccount.id="+stravaAccount.id);
            //     return stravaAccount;
            // })
        } catch (error) {
            console.log("/wrapper.refreshAuthTokenReturnStravaAccount ERROR saving stravaAccount to db");
            throw error;
        }

 
    } catch (error) {
        console.log("/strava-api-wrapper.refreshAuthTokenReturnStravaAccount returning ERROR #1");
        // console.log("AXIOS ERROR START");
        //console.log(error.response); 
        //console.log("error="+JSON.stringify(error));
        // console.log("AXIOS ERROR END");
        throw error;
    }

}

//Doesn't throw errors, returns simple TRUE/FALSE
exports.isTestCallToApiWorking = async (stravaAccount) => {
    console.log("isTestCallToApiWorking called stravaAccount.id="+stravaAccount?.id);
    try{

        //Record the API call
        strava_throttler.recordApiCall();

        let response = await axios.get('https://www.strava.com/api/v3/athlete/', 
            { headers: {Authorization: 'Bearer ' + stravaAccount.auth_token} }
        );

        if (response && response.data && response.data.id){
            return true;
        } 
        
    } catch (error) {
        console.log("/strava-api-wrapper.isTestCallToApiWorking returning ERROR #1");
        // console.log("AXIOS ERROR START");
        //console.log(error.response); 
        //console.log("error="+JSON.stringify(error));
        // console.log("AXIOS ERROR END");  
        throw new StravaAuthError("Test call to API failed.");
    }

    console.log("isTestCallToApiWorking returning FALSE");
    throw new StravaAuthError("Test call to API failed.");
    return false;
}

exports.getWorkoutsAndStoreInDatabase = async (stravaAccount, page, per_page=200) => {
    console.log("getWorkoutsAndStoreInDatabase called");
    try{

        //Verify the auth token or refresh it
        try{
            stravaAccount = await this.verifyAuthReturnStravaAccountICanUse(stravaAccount);
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
                            //console.log("workout UPDATED workoutDb.id="+workoutDb.id+"in DB");
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
                                }
                            }
                        )
                    }
   
                })

            });
            
        } 
        
    } catch (error) {
        console.log("/strava-api-wrapper.getWorkoutsAndStoreInDatabase returning ERROR #1");
        console.log(JSON.stringify(error));
        throw error;
    }
    
}

exports.countTotalActivitiesForAthlete = async (stravaAccount) => {
    //console.log("countTotalActivitiesForAthlete called");
    try{

        //Verify the auth token or refresh it
        try{
            stravaAccount = await this.verifyAuthReturnStravaAccountICanUse(stravaAccount);
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
            console.log("/strava-api-wrapper.countTotalActivitiesForAthlete returning ERROR #2");
            // console.log("AXIOS ERROR START");
            //console.log(error); 
            // console.log("AXIOS ERROR END");
            throw new StravaAuthError("/strava-api-wrapper.countTotalActivitiesForAthlete returning ERROR #2");
        }

    } catch (error) {
        console.log("/strava-api-wrapper.countTotalActivitiesForAthlete returning ERROR #1");
        //console.log(error);
        throw error;
    }
    
}

exports.createWebhookSubscription = async (stravaAccount) => {
    console.log("createWebhookSubscription called stravaAccount.id="+stravaAccount?.id);
    try{

        //Verify the auth token or refresh it
        try{
            stravaAccount = await this.verifyAuthReturnStravaAccountICanUse(stravaAccount);
            //console.log("createWebhookSubscription stravaAccount.auth_token="+stravaAccount.auth_token);
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

        //Build the Strava request to trade an auth code for an access token
        const form_data = new FormData();
        form_data.append('client_id', process.env.STRAVA_CLIENT_ID);
        form_data.append('client_secret', process.env.STRAVA_CLIENT_SECRET);
        form_data.append('callback_url', 'http://www.vo2nft.com/api/stravawebhook');
        form_data.append('verify_token', stravaAccount.id);

        let response = null;
        try{
            console.log("createWebhookSubscription about to call push_subscriptions on Strava API");
            response = await axios.post('https://www.strava.com/api/v3/push_subscriptions', 
                form_data, 
                { headers: form_data.getHeaders() }
            );
        } catch (error){
            throw new StravaAuthError("createWebhookSubscription at Axios call to Strava");
        }

        console.log("createWebhookSubscription push_subscriptions response="+JSON.stringify(response))

        if (response && response.id){
            stravaAccount.webhook_subscription_id = response.id;
            await stravaAccount.save();
        } else {
            console.log("createWebhookSubscription push_subscriptions response was not valid")
            throw new StravaAuthError('push_subscriptions response was not valid');
        }
  
        
    } catch (error) {
        console.log("/strava-api-wrapper.createWebhookSubscription returning ERROR #1");
        // console.log("AXIOS ERROR START");
        //console.log(error.response); 
        //console.log("error="+JSON.stringify(error));
        // console.log("AXIOS ERROR END");  
        throw new StravaAuthError("Call to create webhook subscription failed.");
    }

    console.log("isTestCallToApiWorking returning FALSE");
    throw new StravaAuthError("Test call to API failed.");
    return false;
}

exports.deleteWebhookSubscription = async (stravaAccount) => {
    this.deleteWebhookSubscriptionById(stravaAccount.webhook_subscription_id)
}

exports.deleteWebhookSubscriptionById = async (webhook_subscription_id) => {
    console.log("deleteWebhookSubscriptionById called webhook_subscription_id="+webhook_subscription_id);
    try{

        //Verify the auth token or refresh it
        try{
            stravaAccount = await this.verifyAuthReturnStravaAccountICanUse(stravaAccount);
            //console.log("createWebhookSubscription stravaAccount.auth_token="+stravaAccount.auth_token);
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

        //Build the Strava request to trade an auth code for an access token
        const form_data = new FormData();
        form_data.append('client_id', process.env.STRAVA_CLIENT_ID);
        form_data.append('client_secret', process.env.STRAVA_CLIENT_SECRET);

        let response = null;
        try{
            console.log("deleteWebhookSubscriptionById about to call push_subscriptions on Strava API");
            response = await axios.delete('https://www.strava.com/api/v3/push_subscriptions/'+webhook_subscription_id, 
                form_data, 
                { headers: form_data.getHeaders() }
            );

        } catch (error){
            throw new StravaAuthError("deleteWebhookSubscriptionById at Axios call to Strava");
        }

        console.log("deleteWebhookSubscriptionById push_subscriptions response="+JSON.stringify(response))

        if (response && response.status && response.status===204){
            console.log("deleteWebhookSubscriptionById call to Strava ok, now need to delete from db");
            
            const stravaAccounts = db.sequelize.models.StravaAccount.findAll({
                where: {
                    webhook_subscription_id: webhook_subscription_id
                }
            });

            stravaAccounts.forEach((stravaAccount) => {
                console.log("deleteWebhookSubscriptionById found stravaAccount.id="+stravaAccount.id);
                stravaAccount.webhook_subscription_id = '';
                stravaAccount.save();
            });

        } else {
            console.log("deleteWebhookSubscriptionById push_subscriptions response was not valid")
            throw new StravaAuthError('deleteWebhookSubscriptionById Strava response was not valid');
        }
   
    } catch (error) {
        console.log("/strava-api-wrapper.deleteWebhookSubscriptionById returning ERROR #1");
        // console.log("AXIOS ERROR START");
        //console.log(error.response); 
        //console.log("error="+JSON.stringify(error));
        // console.log("AXIOS ERROR END");  
        throw new StravaAuthError("Call to delete webhook subscription failed.");
    }

    
}


