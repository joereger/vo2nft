const db = require('../models/index.js');
var util = require('util')
const { Op } = require("sequelize");

exports.profile = async function(req, res){
    console.log('/api/profile called');
    console.log("/api/profile req.params.username="+req.params.username);


    var stravaAccount = null;
    var workouts = null;
    const user = await db.sequelize.models.User.findOne({ where: {
        username: req.params.username.toLowerCase() 
    } });
    
    var user_stripped;
    if (user && user.id>0){
        console.log("/api/profile/"+req.params.username+" found user.id="+user.id);

        //Only send the data i want a public profile to see
        user_stripped = Object.assign({}, user.get());
        delete user_stripped.activation_key;
        delete user_stripped.reset_password_count;
        delete user_stripped.reset_password_key;
        delete user_stripped.refresh_token;
        delete user_stripped.password_hash;
        delete user_stripped.password_salt;
        delete user_stripped.reset_password_expiration;
        delete user_stripped.verified;
        delete user_stripped.email;

        // stravaAccount = await db.sequelize.models.StravaAccount.findOne({ where: {
        //     userId: user.id   
        // } });
    

        // if (stravaAccount){
        //     console.log("/api/profile stravaAccount.id=" + stravaAccount.id);
        //     workouts = await db.sequelize.models.Workout.findAll({ where: {
        //         external_account_id: stravaAccount.id   
        //     } });
        // } else {
        //     console.log("/api/workouts stravaAccount=null");   
        // }

    } else {
        console.log("/api/profile/"+req.params.username+" no user found");
    }

    res.set('Content-Type', 'application/json');
    return res.send({user: user_stripped})
    
};

