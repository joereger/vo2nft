const { DateTime } = require('luxon');
const axios = require('axios');
const FormData = require('form-data');
const strava_throttler = require("./strava-api-throttler");
const db = require('../models/index.js');
const StravaThrottleError = require('./strava-error-throttle.js');
const StravaAuthError = require('./strava-error-auth.js');
    

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
        console.log("/strava-api-isTestCallToApiWorking returning ERROR #1");
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

