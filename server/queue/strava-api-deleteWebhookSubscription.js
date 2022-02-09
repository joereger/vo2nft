const { DateTime } = require('luxon');
const axios = require('axios');
const FormData = require('form-data');
const strava_throttler = require("./strava-api-throttler");
const db = require('../models/index.js');
const StravaThrottleError = require('./strava-error-throttle.js');
const StravaAuthError = require('./strava-error-auth.js');
 

exports.deleteWebhookSubscription = async (stravaAccount) => {
    this.deleteWebhookSubscriptionById(stravaAccount.webhook_subscription_id)
}

exports.deleteWebhookSubscriptionById = async (webhook_subscription_id) => {
    console.log("deleteWebhookSubscriptionById called webhook_subscription_id="+webhook_subscription_id);
    try{

        //Verify the auth token or refresh it
        try{
            stravaAccount = await require('./strava-api-verifyAuthReturnStravaAccountICanUse.js').verifyAuthReturnStravaAccountICanUse(stravaAccount);
            //console.log("deleteWebhookSubscription stravaAccount.auth_token="+stravaAccount.auth_token);
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
        console.log("/strava-api-deleteWebhookSubscriptionById returning ERROR #1");
        // console.log("AXIOS ERROR START");
        //console.log(error.response); 
        //console.log("error="+JSON.stringify(error));
        // console.log("AXIOS ERROR END");  
        throw new StravaAuthError("Call to delete webhook subscription failed.");
    }

    
}


