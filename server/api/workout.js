const db = require('../models/index.js');
var util = require('util')
const { Op } = require("sequelize");

exports.get_workout = async function(req, res){
    console.log('/api/workout called');
    console.log("/api/workout req.params.workout_id="+req.params.workout_id);

    var workout = null;
    if (req.params.workout_id){

        workout = await db.sequelize.models.Workout.findOne({ where: {
            id: req.params.workout_id  
        } });

    }
    
    res.set('Content-Type', 'application/json');
    return res.send({workout: workout}) 
};


exports.patch_workout = async function(req, res, next){
    console.log('/API/EDITWORKOUT: req.body='+JSON.stringify(req.body));
    console.log('/API/EDITWORKOUT: req.user='+JSON.stringify(req.user));
    console.log('/API/EDITWORKOUT: req.body.price_in_eth='+req.body.price_in_eth);

    var workout = null;
    try {   
        if (req.params.workout_id){

            workout = await db.sequelize.models.Workout.findOne({ where: {
                id: req.params.workout_id,
                userid_currentowner: req.user.id  
            } });

            if (workout){
                if(req.body.price_in_eth){ 
                    workout.price_in_eth = req.body.price_in_eth;
                    workout.is_price_default = false;
                }
                if(req.body.title){ workout.title = req.body.title;}
                if(req.body.description){ workout.description = req.body.description;}
                await workout.save();
            }

        }
    } catch (err) {
        console.log("/API/EDITWORKOUT error #1");
        console.log(err);
        res.set('Content-Type', 'application/json');
        return res.send(500, { message: "I'm sorry, an unspecified server error has occurred.  This isn't your fault.  Please try again." });
    }

    res.set('Content-Type', 'application/json');
    return res.send({workout: workout})
};

