const db = require('../models/index.js');
const { getToken, COOKIE_OPTIONS, getRefreshToken } = require("../auth/authenticate");
const user = require('../models/user.js');
const sendgridMail = require('@sendgrid/mail')
sendgridMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.resetpassword = async function(req, res, next){
    console.log('/API/RESETPASSWORD: email='+req.body.email+' resetPasswordKeyParam='+req.body.resetPasswordKeyParam);
    try {   
        const User = db.sequelize.models.User;
        User.findOne({
            where: {
                email: req.body.email
            }
        }).then(
            user => {
                if (user) {
                    console.log("/API/RESETPASSWORD: found user where id="+user.id);
                    if (user.reset_password_key == req.body.resetPasswordKeyParam){
                        console.log("/API/RESETPASSWORD: resetKey is VALID");

                        user.setPassword(req.body.password, function(err, user){
                            if(err){
                                console.log("/API/RESETPASSWORD error in user.setPassword()");
                                res.set('Content-Type', 'application/json');
                                return res.send(500, { message: "I'm sorry, the new password was not saved, please try again." });
                            } else {
                                console.log("/API/RESETPASSWORD user.setPassword successful");

                                //Nullify password reset fields and save to db
                                user.reset_password_expiration = null;
                                user.reset_password_key = null;
                                user.reset_password_count = null;
                                user.save().then(
                                    () => {
                                        console.log("/API/FORGOTPASSWORD: user saved!");
                                        return res.send({ message: "Success!" })
                                    }       
                                ) 
                            }
                        })


                    } else {
                        console.log("/API/RESETPASSWORD: resetKey is NOT VALID");  
                        res.set('Content-Type', 'application/json');
                        return res.send(500, { message: "I'm sorry, the reset key is not valid, please try again." });
                    }

                } else {
                    console.log("/API/RESETPASSWORD: user not found");
                }
            },
            err => next(err)
        )
    } catch (err) {
        console.log("/api/forgotpassword error #1");
        console.log(err);
        res.set('Content-Type', 'application/json');
        return res.send(500, { message: "I'm sorry, an unspecified server error has occurred.  This isn't your fault.  Please try again." });
    }

    //return res.send({ message: "Success!" })
};