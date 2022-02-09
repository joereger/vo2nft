const db = require('../models/index.js');
const StravaThrottleError = require('../queue/strava-error-throttle.js');
const StravaAuthError = require('../queue/strava-error-auth.js');

exports.stravawebhookvalidation = async function(req, res){
    console.log('/api/stravawebhookvalidation called req.query='+JSON.stringify(req.query));
    console.log('/api/stravawebhookvalidation will return hub.challenge='+req.query['hub.challenge']);
    res.set('Content-Type', 'application/json');
    return res.send({ "hub.challenge": req.query['hub.challenge'] })
};

exports.stravawebhook = async function(req, res){
    console.log('/api/stravawebhook called req.body='+JSON.stringify(req?.body));

    try { 
        const stravaAccount = await db.sequelize.models.StravaAccount.findOne({
            where: {
                athlete_id: req.body.owner_id
            }
        });
         
        if (stravaAccount && stravaAccount.id && stravaAccount.id>0){

            console.error("stravawebhook stravaAccountid="+stravaAccount.id+" aspect_type="+req.body.aspect_type);

            //ATHLETE==================
            if (req.body.object_type==='athlete'){

                if (req.body.aspect_type==='update'){
                    if ( req.body.updates.profile ){ stravaAthlete.profile_url = req.body.updates.profile };
                    if ( req.body.updates.bio ){ stravaAthlete.bio = req.body.updates.bio };
                    if ( req.body.updates.firstname ){ stravaAthlete.firstname = req.body.updates.firstname };
                    if ( req.body.updates.lastname ){ stravaAthlete.lastname = req.body.updates.lastname };

                    const updates = req.body.updates;
                    const current_strava_data = stravaAccount.strava_data;
                    const new_strava_data = Object.assign(current_strava_data, updates);
                    stravaAccount.strava_data = new_strava_data;

                    await stravaAthlete.save();
                } else if (req.body.aspect_type==='delete'){
                    //TODO mark the athlete hidden/deleted/invisible/something
                } else if (req.body.aspect_type==='create'){
                    //TODO how to handle webhook for create athlete?
                } else {
                    console.log("stravawebhook unknown aspect_type="+req.body.aspect_type);
                }

            //WORKOUT==================
            } else if (req.body.object_type==='activity'){

                //First, see if i have a record of this workout already
                const workout = await db.sequelize.models.Workout.findOne({
                    where: {
                        external_account_id: stravaAccount.id,
                        workout_id: req.body.object_id
                    }
                });

                if (stravaAccount && req.body.aspect_type==='update'){
                    workout.title = req.body.updates.title;
                    const current_strava_data = workout.strava_details;
                    const updated_strava_data = req.body.updates;
                    const new_strava_data = Object.assign(current_strava_data, updated_strava_data);
                    workout.strava_details = new_strava_data;
                    await workout.save();
                    console.log("stravawebhook updated workout.id="+workout.id);
                } else if (stravaAccount && req.body.aspect_type==='delete'){
                    if (workout){
                        workout.status = 'deleted';
                        await workout.save();
                        console.log("stravawebhook marked deleted workout.id="+workoutNew.id);
                    }
                } else if (stravaAccount && req.body.aspect_type==='create'){
                    if (workout && workout.id>0){
                        //TODO handle the case where Strava sends an activity as create that i already have saved
                    } else {
                        // const workoutNew = await db.sequelize.models.Workout.create({ 
                        //     userid_creator: stravaAccount.userId,
                        //     userid_currentowner: stravaAccount.userId,
                        //     external_account_type: 'strava',
                        //     external_account_id: stravaAccount.id,
                        //     workout_date: workout?.start_date,
                        //     workout_id: req.body.object_id,
                        //     title: req.body.updates.title,
                        //     url: 'https://www.strava.com/activities/'+req.body.object_id,
                        //     strava_details: req.body.updates
                        // })
                        // console.log("stravawebhook created new workout.id="+workoutNew.id);
                        
                        //Queue up a job to go get this activity
                        const str = require("../queue/strava-enqueuer-getSingleActivity");
                        str.enqueue(stravaAccount, req.body.object_id);
                        
                    
                    }
                    
        
                } else {
                    console.log("stravawebhook no stravaAccount or unknown aspect_type="+req.body.aspect_type);
                }

            } else {
                console.error("stravawebhook unknwon aspect_type="+req.body.aspect_type);
            }

        }
            
    } catch (err) {
        console.log("/api/misc error #2");
        console.log(err);
        res.statusCode = 401
        res.send("FAIL DERP")
    }

    res.set('Content-Type', 'application/json');
    return res.send({ message: 'ok' })
};
