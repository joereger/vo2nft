const db = require('../models/index.js');
const StravaThrottleError = require('../queue/strava-error-throttle.js');
const StravaAuthError = require('../queue/strava-error-auth.js');

exports.misc = async function(req, res){
    console.log(__filename+' called');


    //STRAVA API THROTTLER
    // const tq = require("../queue/strava-api-throttler");
    // tq.recordApiCall();
    // const apiCallsSoFarInCurrentFifteenMinuteBlock = await tq.apiCallsSoFarInCurrentFifteenMinuteBlock();
    // const apiCallsSoFarToday = await tq.apiCallsSoFarToday();
    // const millisUntilApiAvailable = await tq.millisUntilApiAvailable();
    // const apiCallsRemainingToday = await tq.apiCallsRemainingToday();
    // const apiCallsRemainingThisFifteenMinutes = await tq.apiCallsRemainingThisFifteenMinutes();
    // res.set('Content-Type', 'application/json');
    // return res.send({message: 'ok', apiCallsSoFarInCurrentFifteenMinuteBlock, apiCallsSoFarToday, millisUntilApiAvailable, apiCallsRemainingToday, apiCallsRemainingThisFifteenMinutes })
   
    
    console.log("JSON.stringify(req.query)="+JSON.stringify(req.query));
    console.log("JSON.stringify(req.body)="+JSON.stringify(req.body));

    //Strava token refresh
    var getStravaAccountId = 1;
    if (process.env.NODE_ENV !== 'production') {
        getStravaAccountId = 7;
    }
    if (req.query && req.query.stravaAccountId && req.query.stravaAccountId>0){
        getStravaAccountId = req.query.stravaAccountId;
    }
    if (req.body && req.body.stravaAccountId && req.body.stravaAccountId>0){
        getStravaAccountId = req.body.stravaAccountId;
    }

    try { 
        const StravaAccount = db.sequelize.models.StravaAccount;
        StravaAccount.findOne({
            where: {
                id: getStravaAccountId
            }
        }).then(
            stravaAccount => {
                if (stravaAccount){
                    console.log("misc.js FOUND stravaAccount.id="+stravaAccount.id);
                    //const sa = require("../queue/strava-api-getWorkoutsAndStoreInDatabase"); 
                    //sa.getWorkoutsAndStoreInDatabase(stravaAccount, 1);
                    //Strava queue up harvest
                    //const str = require("../queue/strava-enqueuer-activitySync");
                    //str.enqueue(stravaAccount);
                    //const str = require("../queue/strava-enqueuer-subscribeWebhook");
                    //str.enqueue(stravaAccount);
                    const str = require("../queue/strava-enqueuer-getSingleActivity");
                    str.enqueue(stravaAccount, 6656198544);
                } else {
                    console.log(__filename+" no stravaAccount found for stravaAccountId="+getStravaAccountId);
                }
            },
            err => {console.log("/misc.js error "+err.message);}
        )
    } catch (err) {
        console.log("/api/misc error #2");
        console.log(err);
        res.statusCode = 401
        res.send("FAIL DERP")
    }



    res.set('Content-Type', 'application/json');
    return res.send({message: 'ok' })
};
