const { DateTime } = require('luxon');
const axios = require('axios');
const FormData = require('form-data');
const strava_throttler = require("./strava-api-throttler");
const db = require('../models/index.js');
const StravaThrottleError = require('./strava-error-throttle.js');
const StravaAuthError = require('./strava-error-auth.js');
    

exports.subscribeWebhook = async (stravaAccount) => {
    console.log("subscribeWebhook called stravaAccount.id="+stravaAccount?.id);
    try{

        //Verify the auth token or refresh it
        try{
            stravaAccount = await require('./strava-api-verifyAuthReturnStravaAccountICanUse.js').verifyAuthReturnStravaAccountICanUse(stravaAccount);
            //console.log("subscribeWebhook stravaAccount.auth_token="+stravaAccount.auth_token);
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
        form_data.append('callback_url', 'https://www.vo2nft.com/api/stravawebhook');
        form_data.append('verify_token', stravaAccount.id);

        let response = null;
        try{
            console.log("subscribeWebhook about to call push_subscriptions on Strava API");
            response = await axios.post('https://www.strava.com/api/v3/push_subscriptions', 
                form_data, 
                { headers: form_data.getHeaders() }
            );
        } catch (error){
            console.log("subscribeWebhook error after calling strava push_subscriptions");
            //console.error(error);
            console.log("subscribeWebhook error.response.data="+JSON.stringify(error?.response?.data));
            //response.data
            throw new StravaAuthError("subscribeWebhook at Axios call to Strava");
        }

        console.log("subscribeWebhook push_subscriptions response="+JSON.stringify(response))

        if (response && response.id){
            stravaAccount.webhook_subscription_id = response.id;
            await stravaAccount.save();
        } else {
            console.log("subscribeWebhook push_subscriptions response was not valid")
            throw new StravaAuthError('push_subscriptions response was not valid');
        }
  
        
    } catch (error) {
        console.log("/strava-api-subscribeWebhook returning ERROR #1");
        // console.log("AXIOS ERROR START");
        //console.log(error.response); 
        //console.log("error="+JSON.stringify(error));
        // console.log("AXIOS ERROR END");  
        throw new StravaAuthError("Call to create webhook subscription failed.");
    }

}

