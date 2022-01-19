const db = require('../models/index.js');
const { getToken, COOKIE_OPTIONS, getRefreshToken } = require("../auth/authenticate");
const user = require('../models/user.js');
var util = require('util')

exports.changepassword = async function(req, res, next){
    console.log('/API/CHANGEPASSWORD: req.body='+JSON.stringify(req.body));
    console.log('/API/CHANGEPASSWORD: req.user='+JSON.stringify(req.user));
    console.log('/API/CHANGEPASSWORD: newPassword='+req.body.newPassword);
    try {   
        const User = db.sequelize.models.User;
        User.findOne({
            where: {
                id: req.user.id
            }
        }).then(
            user => {
                console.log("START LOGGING USER");
                console.log(util.inspect(user));
                console.log("END LOGGING USER");
                if (user) {
                    console.log("/API/CHANGEPASSWORD: found user where id="+user.id);

                    user.setPassword( req.body.newPassword, function(err, user){
                        if(err){
                            console.log("/API/CHANGEPASSWORD error in user.setPassword()");
                            res.set('Content-Type', 'application/json');
                            return res.send(500, { message: "I'm sorry, the new password was not saved, please try again." });
                        } else {
                            console.log("/API/CHANGEPASSWORD user.setPassword successful");

                            user.save().then(
                                () => {
                                    console.log("/API/CHANGEPASSWORD: user saved!");
                                    return res.send({ message: "Success!", user: req.user })
                                }       
                            ) 
                        }
                    })

                } else {
                    console.log("/API/CHANGEPASSWORD: user not found");
                }
            },
            err => next(err)
        )
    } catch (err) {
        console.log("/api/changepassword error #1");
        console.log(err);
        res.set('Content-Type', 'application/json');
        return res.send(500, { message: "I'm sorry, an unspecified server error has occurred.  This isn't your fault.  Please try again." });
    }

    //return res.send({ message: "Success!" })
};