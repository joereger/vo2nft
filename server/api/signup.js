const db = require('../models/index.js');
const { getToken, COOKIE_OPTIONS, getRefreshToken } = require("../auth/authenticate")
const { DateTime } = require('luxon');

exports.signup = async function(req, res){
    console.log('/api/signup called in signup.js email='+req.body.email);

    if (process.env.NODE_ENV === 'production') {
        res.set('Content-Type', 'application/json');
        return res.send(400, { message: "Sorry, we're not currently accepting new accounts." });
    }

    //console.log('/api/signup req.body.strava_data='+JSON.stringify(req?.body?.strava_data));

    //Username can't be blank
    if (req.body.username==null || req.body.username==''){ 
        console.log('Username cannot be blank'); 
        res.set('Content-Type', 'application/json');
        return res.send(400, { message: "Doh, the username can't be blank." });
    }

    //TODO verify username checking works
    var usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!usernameRegex.test(req.body.username.toLowerCase())){
        console.log('Username can only use letters and numbers.'); 
        res.set('Content-Type', 'application/json');
        return res.send(400, { message: "Doh, the username can only use letters and numbers.  No spaces are allowed." });    
    }

    //Email can't be blank
    if (req.body.email==null || req.body.email==''){
        console.log('Signup email cannot be blank'); 
        res.set('Content-Type', 'application/json');
        return res.send(400, { message: "Doh, the email can't be blank." });
    }

    //See if this username is already in use
    try {
        usercount = await db.sequelize.models.User.count({ where: { username: req.body.username.toLowerCase() } });
        if (usercount>0){ 
            console.log("Signup.js username already exists "+req.body.username);
            res.set('Content-Type', 'application/json');
            return res.send(400, { message: "Oops, that username already exists.  Please choose another." });
        } else {
            console.log("Signup.js username doesn't appear to exist:  "+req.body.username);    
        }  
    } catch (error){
        console.error('Signup failed: ', error);
        res.set('Content-Type', 'application/json');
        return res.send(500, { message: "Durn, an unspecified server error has occurred.  This isn't your fault.  Please try again." });
    }

    //See if this email is already in use
    try {
        usercount = await db.sequelize.models.User.count({ where: { email: req.body.email } });
        if (usercount>0){ 
            console.log("Signup.js Email already exists "+req.body.email);
            res.set('Content-Type', 'application/json');
            return res.send(400, { message: "Oops, that email already exists.  Consider logging in instead?" });
        } else {
            console.log("Signup.js Email doesn't appear to exist:  "+req.body.email);    
        }  
    } catch (error){
        console.error('Signup failed: ', error);
        res.set('Content-Type', 'application/json');
        return res.send(500, { message: "Durn, an unspecified server error has occurred.  This isn't your fault.  Please try again." });
    }
    

    //Verify that passwords match
    // if (req.body.password!=req.body.confirmpassword){
    //     console.log("Signup: passwords don't match"); 
    //     res.set('Content-Type', 'application/json');
    //     return res.send(400, { message: "Whoopsie, looks like your passwords don't match.  Please try again." });    
    // } else {
    //     console.log("Signup: passwords match");    
    // }

    //Register with auth strategies using User.register(var1=user, var2=password, var3=function)
    try {

        const User = db.sequelize.models.User;
        await User.register(
            User.build({ email: req.body.email, username: req.body.username.toLowerCase() }),
            req.body.password,
            (err, user) => {
              if (err) {
                //Error in auth framework FML
                console.error("signup.js[error #1] "+JSON.stringify(err, ["message", "arguments", "type", "name", "stack"]));
                res.set('Content-Type', 'application/json');
                return res.send(500, { message: "Durn, an unspecified server error has occurred.  This isn't your fault.  Please try again." });
              } else {

                //Generate a refresh token and save it on user
                const token = getToken({ _id: user.id })
                const refreshToken = getRefreshToken({ _id: user.id })
                user.refresh_token = [refreshToken];
                user.name = req.body.name;
                user.username = req.body.username;
                user.default_price_in_eth = .003;
                user.save();

                //Save the Strava data
                if (req.body.strava_data){
                    const StravaAccount = db.sequelize.models.StravaAccount;

                    // var bio = req.body.strava_data.athlete.bio
                    // if (bio === null){ bio = " "}
                    // var profile_pic = req.body.strava_data.athlete.profile
                    // if (profile_pic === null){ profile_pic = " "}

                    const auth_token_expires_at = DateTime.fromSeconds(req.body.strava_data.expires_at).toUTC();

                    StravaAccount.create({ 
                        userId: user.id,
                        username: req.body.strava_data.athlete.username,
                        athlete_id: req.body.strava_data.athlete.id,
                        auth_token: req.body.strava_data.access_token,
                        auth_token_expires_at: auth_token_expires_at,
                        refresh_token: req.body.strava_data.refresh_token,
                        profile_pic: req.body.strava_data.athlete.profile,
                        bio: req.body.strava_data.athlete.bio,
                        firstname: req.body.strava_data.athlete.firstname,
                        lastname: req.body.strava_data.athlete.lastname,
                        strava_details: req.body.strava_data.athlete 
                    }).then(
                        stravaAccount => {
                            if (stravaAccount) {
                                console.log("/api/signup stravaAccount created stravaAccount.id="+stravaAccount.id);
                        
                                //Kick off initial account sync and webhook subscriptions
                                const str = require("../queue/strava-job-acvititySync");
                                str.enqueue(stravaAccount);
                                const str2 = require("../queue/strava-job-subscribeWebhook");
                                str2.enqueue(stravaAccount);

                                //Update user profile_pic
                                if (stravaAccount && stravaAccount.profile_pic){
                                    user.profile_pic = stravaAccount.profile_pic;
                                    user.save();
                                }

                                //Respond to client including refreshToken as cookie
                                res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
                                return res.send({ message: "Yay!  Signup was successful!", success: true, token, user: user, stravaAccount: stravaAccount })

                            }
                        }
                    )
                    
                } else {
                    //Respond to client including refreshToken as cookie
                    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
                    return res.send({ message: "Yay!  Signup was successful!", success: true, token, user: user })
                }


              }
            }
        )

        // //Find the new user
        // User.findOne({
        //     where: {
        //         email: req.body.email
        //     }
        // }).then(
        //     user => {
        //         if (user) {

                    
                      
        //         }
        //     }
        // )

        
    } catch (error){
        console.log('Signup failed: DEBUG #5', error);
        res.set('Content-Type', 'application/json');
        return res.send(500, { message: "Durn, an unspecified server error has occurred.  This isn't your fault.  Please try again." });
    }

};