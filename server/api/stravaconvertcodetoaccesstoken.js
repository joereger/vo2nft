const db = require('../models/index.js');
const { getToken, COOKIE_OPTIONS, getRefreshToken } = require("../auth/authenticate");
const user = require('../models/user.js');
const axios = require('axios');
const FormData = require('form-data');

exports.strava_convert_code_to_access_token = async function(req, res, next){
    console.log('/api/strava_convert_code_to_access_token code='+req.body.code);

    try{
        //Build the Strava request to trade an auth code for an access token
        const form_data = new FormData();
        form_data.append('client_id', process.env.STRAVA_CLIENT_ID);
        form_data.append('client_secret', process.env.STRAVA_CLIENT_SECRET);
        form_data.append('code', req.body.code);
        form_data.append('grant_type', 'authorization_code');

        let response = await axios.post('https://www.strava.com/api/v3/oauth/token', 
            form_data, 
            { headers: form_data.getHeaders() }
        );

        let data = response.data;
        console.log(data);
        console.log("data.token_type="+data.token_type);
        console.log("data.expires_at="+data.expires_at);
        console.log("data.expires_in="+data.expires_in);
        console.log("data.refresh_token="+data.refresh_token);
        console.log("data.access_token="+data.access_token);
        console.log("data.athlete="+data.athlete);

        //Get athlete details
        let data2 = null;
        let strava_data = null;
        try{ 
            // const form_data2 = new FormData();
            // form_data2.append('client_id', process.env.STRAVA_CLIENT_ID);
            // form_data2.append('client_secret', process.env.STRAVA_CLIENT_SECRET);
            // form_data2.append('code', req.body.code);
            // form_data2.append('grant_type', 'authorization_code');

            let response2 = await axios.get('https://www.strava.com/api/v3/athletes/'+data.athlete.id+'/stats', 
                { headers: {Authorization: 'Bearer ' + data.access_token} }
            );

            data2 = response2.data;

            strava_data = Object.assign(data, data2);

            console.log("====== start strava_data ======");
            console.log(strava_data);
            console.log("====== end strava_data ======");
        } catch (error) {
            console.log("/api/strava_convert_code_to_access_token returning 401 ERROR #2");
            // console.log("AXIOS ERROR START");
            console.log(error.response); 
            // console.log("AXIOS ERROR END");
        }

        //Respond
        //res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
        return res.send({ message: "Kaboom!  Strava connection was successful!", success: true, strava_data: strava_data })
    } catch (error) {
        console.log("/api/strava_convert_code_to_access_token returning 401 ERROR #1");
        // console.log("AXIOS ERROR START");
        console.log(error.response); 
        // console.log("AXIOS ERROR END");
        res.statusCode = 401
        res.send("Unauthorized")
    }
   
};