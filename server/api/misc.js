const db = require('../models/index.js');
const StravaThrottleError = require('../queue/strava-errors.js');
const StravaAuthError = require('../queue/strava-errors.js');

exports.misc = async function(req, res){
    console.log('/api/misc called');

    const stravaThrottleError = new StravaThrottleError("brokes");
    const stravaAuthError = new StravaAuthError("brokes");

    //BULL QUEUE/FLOWS
    //const tq = require("../queue/test-queue");
    //tq.submitFlow();

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
   
    //Strava token refresh
    try { 
        const StravaAccount = db.sequelize.models.StravaAccount;
        StravaAccount.findOne({
            where: {
                id: 7
            }
        }).then(
            stravaAccount => {
                //console.log("misc.js stravaAccount="+JSON.stringify(stravaAccount));
                //const sa = require("../queue/strava-api-wrapper"); 
                //sa.getWorkoutsAndStoreInDatabase(stravaAccount, 1);
                //Strava queue up harvest
                const str = require("../queue/strava-enqueuer");
                str.stravaActivitySync(stravaAccount);
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
