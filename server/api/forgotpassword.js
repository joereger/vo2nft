const db = require('../models/index.js');
const { getToken, COOKIE_OPTIONS, getRefreshToken } = require("../auth/authenticate");
const user = require('../models/user.js');
const sendgridMail = require('@sendgrid/mail')
sendgridMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.forgotpassword = async function(req, res, next){
    console.log('/API/FORGOTPASSWORD: email='+req.body.email);
    try {   
        const User = db.sequelize.models.User;
        User.findOne({
            where: {
                email: req.body.email
            }
        }).then(
            user => {
                if (user) {
                    console.log("/API/FORGOTPASSWORD: found user where id="+user.id);
                    if (user.reset_password_count<=5){
                        
                        //Set password reset vars in User object
                        user.reset_password_key = Math.random().toString(36).slice(2);
                        console.log("/API/FORGOTPASSWORD: user.reset_password_key="+user.reset_password_key);

                        if (user.reset_password_count && user.reset_password_count>=0){
                            user.reset_password_count = user.reset_password_count + 1;
                        } else {
                            user.reset_password_count = 1;
                        }
                        console.log("/API/FORGOTPASSWORD: user.reset_password_count="+user.reset_password_count);

                        const date = new Date();
                        date.setDate(date.getDate() + 1);
                        console.log("/API/FORGOTPASSWORD: expiration date will be: "+date)
                        user.reset_password_expiration = date;
                        
                        //Save User record to database
                        user.save().then(
                            () => {
                                console.log("/API/FORGOTPASSWORD: user saved!");
                            }       
                        ) 

                        //Send the email
                        const msg = {
                            to: req.body.email, 
                            from: 'support@vo2nft.com', 
                            subject: 'Vo2NFT Password Reset Instructions',
                            text: 'Please visit this page to reset your password: http://'+req.get('host')+'/reset-password/'+user.reset_password_key,
                            html: "Please <a href='http://"+req.get('host')+"/reset-password/"+user.reset_password_key+"'>click here</a> to reset your password.",
                        }
                        
                        sendgridMail
                        .send(msg)
                        .then((response) => {
                            console.log(response[0].statusCode)
                            console.log(response[0].headers)
                        })
                        .catch((error) => {
                            console.error(error)
                        })
                        


                    } else {
                        console.log("User has done too many password reset attempts user where email="+req.user.email);   
                    }

                } 
            },
            err => next(err)
        )
    } catch (err) {
        console.log("/api/forgotpassword error #1");
        console.log(err);
    }

    
    return res.send({ message: "Success!" })
};