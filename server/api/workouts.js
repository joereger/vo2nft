const db = require('../models/index.js');
var util = require('util')
const { Op } = require("sequelize");

exports.workouts = async function(req, res){
    console.log('/api/user/'+req?.params?.username+'/workouts called');

    var user = null;
    var user_stripped = null;
    // const user = await db.sequelize.models.User.findOne({ where: {
    //     username: req.params.username 
    // } });
    if (req.params.username){
        user = await db.sequelize.models.User.findOne({ where: {
            username: req?.params?.username.toLowerCase()  
        } });

        //console.log("user = "+JSON.stringify(user));

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
     
    }

    if (!user || !user.id>0){
        res.set('Content-Type', 'application/json');
        return res.send({})
    }

    const stravaAccount = await db.sequelize.models.StravaAccount.findOne({ 
        where: {
            userId: user.id   
        }
    });
    console.log("req.user.id="+user.id);

    if (stravaAccount){
        console.log("/api/workouts stravaAccount.id=" + stravaAccount.id);
        const workouts = await db.sequelize.models.Workout.findAll({ 
            where: {
                external_account_id: stravaAccount.id   
            },
            order: [
                ['workout_date', 'DESC']
            ]
        });
        res.set('Content-Type', 'application/json');
        return res.send({workouts: workouts})
    } else {
        console.log("/api/workouts stravaAccount=null");   
    }

    res.set('Content-Type', 'application/json');
    return res.send({})
};

