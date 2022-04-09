const db = require('../models/index.js');
var util = require('util')
const { Op } = require("sequelize");

exports.workout = async function(req, res){
    console.log('/api/workout called');
    console.log("/api/workout req.params.workout_id="+req.params.workout_id);

    var workout = null;
    // const user = await db.sequelize.models.User.findOne({ where: {
    //     username: req.params.username 
    // } });
    if (req.params.workout_id){

        workout = await db.sequelize.models.Workout.findOne({ where: {
            id: req.params.workout_id  
        } });

        //console.log("workout = "+JSON.stringify(workout));

    }
    
    

        

    res.set('Content-Type', 'application/json');
    return res.send({workout: workout})
    
};

