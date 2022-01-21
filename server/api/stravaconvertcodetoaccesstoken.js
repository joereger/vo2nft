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

        //Respond to client including refreshToken as cookie
        //res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
        return res.send({ message: "Kaboom!  Strava connection was successful!", success: true, data: data })
    } catch (error) {
        // console.log("AXIOS ERROR START");
        // console.log(error.response); 
        // console.log("AXIOS ERROR END");
        res.statusCode = 401
        res.send("Unauthorized")
    }
   
};