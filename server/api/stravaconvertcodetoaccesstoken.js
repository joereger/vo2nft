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

            let response2 = await axios.get('https://www.strava.com/api/v3/athletes/'+data.athlete.id+'/stats', 
                { headers: {Authorization: 'Bearer ' + data.access_token} }
            );

            data2 = response2.data;
            strava_data = Object.assign(data, data2);

            //Save the Strava data
            console.log("/api/stravaconvertcodetoaccesstoken user_id="+req.body.user_id);
            if (strava_data){
                console.log("/api/stravaconvertcodetoaccesstoken strava_data is present");
                console.log(JSON.stringify(strava_data));

                var user = null;
                if (req?.body?.user_id && req?.body?.user_id>0){
                    console.log("/api/stravaconvertcodetoaccesstoken we have a valid userid we can use");
                    

                }
          
    
                // const auth_token_expires_at = DateTime.fromSeconds(req.body.strava_data.expires_at).toUTC();
                // if (req.user.stravaAccount){

                // }
                // const stravaAccountNew = await db.sequelize.models.StravaAccount.create({ 
                //     userId: req.user.id,
                //     username: req.body.strava_data.athlete.username,
                //     athlete_id: req.body.strava_data.athlete.id,
                //     auth_token: req.body.strava_data.access_token,
                //     auth_token_expires_at: auth_token_expires_at,
                //     refresh_token: req.body.strava_data.refresh_token,
                //     profile_pic: req.body.strava_data.athlete.profile,
                //     bio: req.body.strava_data.athlete.bio,
                //     firstname: req.body.strava_data.athlete.firstname,
                //     lastname: req.body.strava_data.athlete.lastname,
                //     strava_details: req.body.strava_data.athlete 
                // });
                      
                // console.log("/api/stravaconvertcodetoaccesstoken stravaAccount created stravaAccount.id="+stravaAccountNew.id);
                    
            }

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