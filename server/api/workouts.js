const db = require('../models/index.js');
var util = require('util')
const { Op } = require("sequelize");

exports.workouts = async function(req, res){
    console.log('/api/workouts called');

    const stravaAccount = await db.sequelize.models.StravaAccount.findOne({ where: {
        userId: req.user.id   
    } });
    console.log("req.user.id="+req.user.id);

    if (stravaAccount){
        console.log("/api/workouts travaAccount.id=" + stravaAccount.id);
        const workouts = await db.sequelize.models.Workout.findAll({ where: {
            external_account_id: stravaAccount.id   
        } });
        res.set('Content-Type', 'application/json');
        return res.send({workouts: workouts})
    } else {
        console.log("/api/workouts stravaAccount=null");   
    }

    res.set('Content-Type', 'application/json');
    return res.send({})
};

