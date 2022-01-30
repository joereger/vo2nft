const { DateTime } = require('luxon');


//Strava auth handler manages tokens/etc per the docs: https://developers.strava.com/docs/authentication/


//Called before any Strava API calls, this method checks the local token to see if it's expired.
//If expired it'll try to refresh the access token using the refresh token.
exports.verifyAuth = (stravaAccount) => {
    console.log("strava-auth-handler called stravaAccount="+JSON.stringify(stravaAccount));
    const auth_token_expires_at = stravaAccount.auth_token_expires_at;
    const auth_token_expires_at_luxon = DateTime.fromJSDate(auth_token_expires_at);
    console.log("auth_token_expires_at="+JSON.stringify(auth_token_expires_at));
    console.log("auth_token_expires_at_luxon="+auth_token_expires_at_luxon);

    //const millisUntilEspiration = fifteenMinExpireAt.diff(DateTime.now().toUTC()).milliseconds;
    //const millisUntilExpiration = DateTime.now().toUTC().diff(auth_token_expires_at_luxon).milliseconds;
    const millisUntilExpiration = auth_token_expires_at_luxon.diff(DateTime.now().toUTC()).milliseconds;
    console.log("millisUntilExpiration="+millisUntilExpiration);

    //I like calculating the time until expiration because i can gut check with debug checks
    if(millisUntilExpiration > 0){
        console.log("strava auth_token NOT EXPIRED -> auth_token_expires_at="+auth_token_expires_at+" DateTime.now().toUTC()="+DateTime.now().toUTC());
        //What to do here?
    } else {
        console.log("strava auth_token EXPIRED -> auth_token_expires_at="+auth_token_expires_at+" DateTime.now().toUTC()="+DateTime.now().toUTC());   
    
    }



    

}


