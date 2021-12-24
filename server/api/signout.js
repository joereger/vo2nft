const db = require('../models/index.js');
const jwt = require("jsonwebtoken");
const { getToken, COOKIE_OPTIONS, getRefreshToken } = require("../auth/authenticate");
const user = require('../models/user.js');

exports.signout = async function(req, res, next){
    console.log('/api/signout AUTHED PROPERLY in signout.js');
    console.log("req.user.refresh_token="+req.user.refresh_token);

    const { signedCookies = {} } = req
    const { refreshToken } = signedCookies

    if (refreshToken) {
        console.log("refreshToken EXISTS and ="+refreshToken);
        try {
            const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
            const userId = payload._id
            //console.log("payload._id=userId="+userId);

            const User = db.sequelize.models.User;
            User.findOne({
                where: {
                    id: userId
                }
            }).then(
                user => {
                if (user) {
                    console.log("found user where id="+user.id);
                    console.log("user.refreshToken="+JSON.stringify(user.refresh_token, null, 2));

                    if (Array.isArray(user.refresh_token)){
                        console.log("user.refresh_token IS an array");
                        const tokenIndex = user.refresh_token.indexOf(refreshToken);
                        if (tokenIndex<0){
                            console.log("TOKEN NOT FOUND so NOT refreshing token");
                            res.statusCode = 401
                            res.send("Unauthorized")
                        } else {
                            //console.log("TOKEN FOUND and tokenIndex="+tokenIndex+" so let's refresh that mofo");

                            //Delete the token
                            const temp_refresh_token = user.refresh_token;
                            for( var i = 0; i < temp_refresh_token.length; i++){ 
                                console.log("looking at index i="+i);
                                if ( temp_refresh_token[i] === refreshToken) { 
                                    console.log("FOUND refreshToken in temp_refresh_token so splicing("+i+", 1)");
                                    temp_refresh_token.splice(i, 1); 
                                }
                            }

                            //Set the user's value to the array without the refreshToken and save
                            user.refresh_token = temp_refresh_token;
           
                            user.save().then(
                                () => {
                                    console.log("the user has been saved"); 
                                    res.clearCookie("refreshToken", COOKIE_OPTIONS);
                                    return res.send({ success: true });
                                }       
                            )  
 
                        }
                    }

                } else {
                    console.log("user IS NOT FUCKING REAL");
                    res.statusCode = 401
                    res.send("Unauthorized, please try again")
                }
                },
                err => next(err)
            )
        } catch (err) {
            console.log("/api/signout ERROR #2");
            console.log(err);
            res.statusCode = 401
            res.send("Unauthorized, please try again")
        }
    } else {
        console.log("/api/signout ERROR #3");
        res.statusCode = 401
        res.send("Unauthorized, please try again")
    }
    
   
};