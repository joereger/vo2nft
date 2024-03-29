const db = require('../models/index.js');
const { getToken, COOKIE_OPTIONS, getRefreshToken } = require("../auth/authenticate");
const user = require('../models/user.js');

exports.login = async function(req, res, next){
    console.log('/api/login AUTHED PROPERLY in login.js email='+req.body.email);

    //Generate a refresh token and save it on user
    const token = getToken({ _id: req.user.id });
    const refreshToken = getRefreshToken({ _id: req.user.id });
    console.log("LOGIN getToken() = "+ token);
    console.log("LOGIN getRefreshToken() = "+ refreshToken);

    //If this refreshToken isn't yet in req.user.refresh_token, add it and save user
    //console.log("req.user.refresh_token="+req.user.refresh_token);
    if (Array.isArray(req.user.refresh_token)){
        console.log("req.user.refresh_token IS an array");
        if (req.user.refresh_token.indexOf(refreshToken)<0){
            console.log("TOKEN NOT YET SAVED");
            const temp_refresh_token = req.user.refresh_token;
            temp_refresh_token.push(refreshToken);
            req.user.refresh_token = temp_refresh_token;
            req.user.save();
            console.log("getRefreshToken() = "+ refreshToken);
            console.log("req.user.refresh_token="+req.user.refresh_token);
        } else {
            console.log("TOKEN ALREADY SAVED");
        }
    } else {
        console.log("req.user.refresh_token NOT an array");
        const temp_refresh_token = [];
        temp_refresh_token.push(refreshToken);
        req.user.refresh_token = temp_refresh_token;
        req.user.save();
        console.log("getRefreshToken() = "+ refreshToken);
        console.log("req.user.refresh_token="+req.user.refresh_token);
    }

    //Retreive StravaAccount
    var stravaAccount;
    if (req.user && req.user.id>0){
        stravaAccount = db.sequelize.models.StravaAccount.findOne({
            where: {
                userId: req.user.id
            }
        })
    }
    
    //Respond to client including refreshToken as cookie
    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
    return res.send({ message: "Sweet!  Log in was successful!", success: true, token, user: req.user, stravaAccount: stravaAccount })
    
   
};