const { DateTime } = require('luxon');
const axios = require('axios');
const FormData = require('form-data');
const strava_throttler = require("./strava-api-throttler");
const db = require('../models/index.js');
const StravaThrottleError = require('./strava-error-throttle.js');
const StravaAuthError = require('./strava-error-auth.js');
    
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
        console.log("/strava-api-refreshAuthTokenReturnStravaAccount returning ERROR #1");
        // console.log("AXIOS ERROR START");
        //console.log(error.response); 
        //console.log("error="+JSON.stringify(error));
        // console.log("AXIOS ERROR END");
        throw error;
    }

}
