const db = require('../models/index.js');
var util = require('util')
const { Op } = require("sequelize");

exports.profile = async function(req, res){
    console.log('/api/profile called');
    console.log("/api/profile req.params.username="+req.params.username);


    var stravaAccount = null;
    var workouts = null;
    const user = await db.sequelize.models.User.findOne({ where: {
        username: req.params.username 
    } });
    
    if (user && user.id>0){
        console.log("/api/profile/"+req.params.username+" found user.id="+user.id);

        stravaAccount = await db.sequelize.models.StravaAccount.findOne({ where: {
            userId: user.id   
        } });
    

        if (stravaAccount){
            console.log("/api/profile stravaAccount.id=" + stravaAccount.id);
            workouts = await db.sequelize.models.Workout.findAll({ where: {
                external_account_id: stravaAccount.id   
            } });
        } else {
            console.log("/api/workouts stravaAccount=null");   
        }
    } else {
        console.log("/api/profile/"+req.params.username+" no user found");
    }

    res.set('Content-Type', 'application/json');
    return res.send({user: user, workouts: workouts})
    
};

