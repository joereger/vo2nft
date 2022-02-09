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
    console.log("strava-api-verifyAuthReturnStravaAccountICanUse called stravaAccount.id="+stravaAccount.id);
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
            const out = await require('./strava-api-refreshAuthTokenReturnStravaAccount.js').refreshAuthTokenReturnStravaAccount(stravaAccount)
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


