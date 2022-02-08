const db = require('../models/index.js');
const jwt = require("jsonwebtoken");
const { getToken, COOKIE_OPTIONS, getRefreshToken } = require("../auth/authenticate");

exports.refreshtoken = async function(req, res){
    console.log('/API/REFRESHTOKEN called >>>>>>>>>>>>>>>>>');
    console.log('/api/refreshtoken req.headers='+JSON.stringify(req.headers));

    const { signedCookies = {} } = req
    const { refreshToken } = signedCookies
    console.log("/api/refreshtoken signedCookies="+JSON.stringify(signedCookies));
    console.log("/api/refreshtoken req.body="+JSON.stringify(req.body));
    
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
                    //console.log("user.refreshToken="+JSON.stringify(user.refresh_token, null, 2));

                    if (Array.isArray(user.refresh_token)){
                        //console.log("user.refresh_token IS an array");
                        const tokenIndex = user.refresh_token.indexOf(refreshToken);
                        if (tokenIndex<0){
                            console.log("TOKEN NOT FOUND so NOT refreshing token");
                            res.statusCode = 401
                            res.send("Unauthorized")
                        } else {
                            console.log("TOKEN FOUND and tokenIndex="+tokenIndex+" so let's refresh that mofo");

                            //Generate a new refreshToken for this id
                            const newRefreshToken = getRefreshToken({ _id: userId })
                            const token = getToken({ _id: userId });

                            //Replace most recent token with newly generated one
                            const temp_refresh_token = user.refresh_token;
                            temp_refresh_token[tokenIndex] = newRefreshToken;
                            user.refresh_token = temp_refresh_token;
           
                            user.save().then(
                                () => {
                                    //console.log("the user has been saved, returning refreshToken in cookie"); 
                                    console.log('/API/REFRESHTOKEN done, returning refreshToken to browser <<<');
                                    res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS)
                                    return res.send({ success: true, token, user })  
                                }       
                            )  
 
                        }
                    } else {
                        console.log("user.refresh_token NOT an array so not refreshing token");
                        res.statusCode = 401
                        res.send("Unauthorized")
                    }

                } else {
                    console.log("user IS NOT FUCKING REAL");
                    res.statusCode = 401
                    res.send("Unauthorized")
                }
                },
                err => next(err)
            )
        } catch (err) {
            console.log("/api/refreshtoken error #2");
            console.log(err);
            res.statusCode = 401
            res.send("Unauthorized")
        }
    } else {
        console.log("/api/refreshtoken if(refreshToken) is FALSE");
        res.statusCode = 401
        res.send("Unauthorized")
    }
};   