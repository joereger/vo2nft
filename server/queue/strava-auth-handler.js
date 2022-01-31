const { DateTime } = require('luxon');
const axios = require('axios');
const FormData = require('form-data');
const strava_throttler = require("../queue/strava-api-throttler");
    


//Strava auth handler manages tokens/etc per the docs: https://developers.strava.com/docs/authentication/


//Called before any Strava API calls, this method checks the local token to see if it's expired.
//If expired it'll try to refresh the access token using the refresh token.
exports.verifyAuth = (stravaAccount) => {
    console.log("strava-auth-handler called stravaAccount="+JSON.stringify(stravaAccount));
    const auth_token_expires_at = stravaAccount.auth_token_expires_at;
    const auth_token_expires_at_luxon = DateTime.fromJSDate(auth_token_expires_at);
    console.log("auth_token_expires_at="+JSON.stringify(auth_token_expires_at));
    console.log("auth_token_expires_at_luxon="+auth_token_expires_at_luxon);

    const millisUntilExpiration = auth_token_expires_at_luxon.diff(DateTime.now().toUTC()).milliseconds;
    console.log("millisUntilExpiration="+millisUntilExpiration);

    //I like calculating the time until expiration because i can gut check with debug statements.
    //A simple date comparison can hide a lot of complexity... timezone shifts, etc.
    if(millisUntilExpiration > 0){
        console.log("strava auth_token NOT EXPIRED -> auth_token_expires_at="+auth_token_expires_at+" DateTime.now().toUTC()="+DateTime.now().toUTC());
        //What to do here?
    } else {
        console.log("strava auth_token EXPIRED -> auth_token_expires_at="+auth_token_expires_at+" DateTime.now().toUTC()="+DateTime.now().toUTC());   
        //Ok, here we are, the token has expired, now we need to use the refresh token call to get a new token
        this.refreshAuthToken(stravaAccount);
    }

}

exports.refreshAuthToken = async (stravaAccount) => {
    try{

        //Record the API call
        strava_throttler.recordApiCall();

        //Build the Strava request to trade an auth code for an access token
        const form_data = new FormData();
        form_data.append('client_id', process.env.STRAVA_CLIENT_ID);
        form_data.append('client_secret', process.env.STRAVA_CLIENT_SECRET);
        form_data.append('grant_type', 'refresh_token');
        form_data.append('refresh_token', stravaAccount.refresh_token);

        let response = await axios.post('https://www.strava.com/api/v3/oauth/token', 
            form_data, 
            { headers: form_data.getHeaders() }
        );

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
            stravaAccount.save().then(() => {
                //console.log("stravaAccount saved stravaAccount.id="+stravaAccount.id);
            })
        } catch (error) {
            console.log("/strava_auth_handler ERROR saving stravaAccount to db");
            // console.log("AXIOS ERROR START");
            console.log(error.response); 
            // console.log("AXIOS ERROR END"); 
        }

 
    } catch (error) {
        console.log("/strava_auth_handler returning 401 ERROR #1");
        // console.log("AXIOS ERROR START");
        //console.log(error.response); 
        console.log("error="+JSON.stringify(error));
        // console.log("AXIOS ERROR END");
        
    }

}

exports.isTestCallToApiWorking = async (stravaAccount) => {
    console.log("isTestCallToApiWorking called stravaAccount="+JSON.stringify(stravaAccount));
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
        console.log("/strava_auth_handler returning 401 ERROR #1");
        // console.log("AXIOS ERROR START");
        //console.log(error.response); 
        console.log("error="+JSON.stringify(error));
        // console.log("AXIOS ERROR END");  
    }

    console.log("isTestCallToApiWorking returning FALSE");
    return false;
    

}


