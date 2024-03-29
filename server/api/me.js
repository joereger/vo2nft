const db = require('../models/index.js');
var util = require('util')
const { Op } = require("sequelize");

exports.me = async function(req, res){
    console.log('/api/me called');
    res.set('Content-Type', 'application/json');
    return res.send(req.user)
};

exports.meUpdate = async function(req, res, next){
    console.log('/API/MEUPDATE called');
    //console.log('/API/MEUPDATE: req.body='+JSON.stringify(req.body));
    //console.log('/API/MEUPDATE: req.user='+JSON.stringify(req.user));

    try {   
        const User = db.sequelize.models.User;

        var usernameRegex = /^[a-zA-Z0-9]+$/;
        if (!usernameRegex.test(req.body?.username.toLowerCase())){
            console.log('Username can only use letters and numbers.'); 
            res.set('Content-Type', 'application/json');
            return res.send(400, { message: "Oops, the username can only use letters and numbers.  No spaces are allowed." });    
        }

        if (req.body.username && req.body.username.length>15){
            console.log('Username must be <= 15 characters.'); 
            res.set('Content-Type', 'application/json');
            return res.send(400, { message: "Oops, the username must be 15 characters or less." });    
        }

        //Validation of username uniqueness
        const numWithUsername = await User.count({
            where: {
                id: {
                [Op.ne]: req.user.id
                },
                username: req.body.username.toLowerCase()
            }
         });
         if (numWithUsername>0){
            console.log("/API/MEUPDATE username already exists "+req.body.username);
            res.set('Content-Type', 'application/json');
            return res.send(400, { message: "Oops, that username already exists.  Please consider another." });
         } 

         //Validation of email uniqueness
        const numWithEmail = await User.count({
            where: {
                id: {
                [Op.ne]: req.user.id
                },
                email: req.body.email
            }
         });
         if (numWithEmail>0){
            console.log("/API/MEUPDATE email already exists "+req.body.email);
            res.set('Content-Type', 'application/json');
            return res.send(400, { message: "Oops, that email already exists.  Please consider another." });
         } 

        //TODO validation of name not null and not too long
        if (!req.body.name || req.body.name.length < 1 || req.body.name.length > 60){
            res.set('Content-Type', 'application/json');
            return res.send(400, { message: "Sorry, your name is required and must be at least one character in length and less than 60." });
        }

        //Update the user
        User.findOne({
            where: {
                id: req.user.id
            }
        }).then(
            user => {
                //console.log("START LOGGING USER");
                //console.log(util.inspect(user));
                //console.log("END LOGGING USER");
                if (user) {
                    console.log("/API/MEUPDATE: found user where id="+user.id);

                    user.email = req.body.email;
                    user.name = req.body.name;
                    user.username = req.body.username.toLowerCase();

                    user.save().then(
                        () => {
                            console.log("/API/MEUPDATE: user saved!");
                            return res.send({ message: "Success!", user: user })
                        }       
                    ) 

                } else {
                    console.log("/API/MEUPDATE: user not found");
                }
            },
            err => next(err)
        )
    } catch (err) {
        console.log("/API/MEUPDATE error #1");
        console.log(err);
        res.set('Content-Type', 'application/json');
        return res.send(500, { message: "I'm sorry, an unspecified server error has occurred.  This isn't your fault.  Please try again." });
    }

};