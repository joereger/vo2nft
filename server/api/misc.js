const db = require('../models/index.js');
const StravaThrottleError = require('../queue/strava-error-throttle.js');
const StravaAuthError = require('../queue/strava-error-auth.js');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const url = require('url');

exports.misc = async function(req, res){
    console.log(__filename+' called');
    //console.log("JSON.stringify(req.query)="+JSON.stringify(req.query));
    //console.log("JSON.stringify(req.body)="+JSON.stringify(req.body));


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
    // var getStravaAccountId = 1;
    // if (process.env.NODE_ENV !== 'production') {
    //     getStravaAccountId = 7;
    // }
    // if (req.query && req.query.stravaAccountId && req.query.stravaAccountId>0){
    //     getStravaAccountId = req.query.stravaAccountId;
    // }
    // if (req.body && req.body.stravaAccountId && req.body.stravaAccountId>0){
    //     getStravaAccountId = req.body.stravaAccountId;
    // }

    // try { 
    //     const StravaAccount = db.sequelize.models.StravaAccount;
    //     StravaAccount.findOne({
    //         where: {
    //             id: getStravaAccountId
    //         }
    //     }).then(
    //         stravaAccount => {
    //             if (stravaAccount){
    //                 console.log("misc.js FOUND stravaAccount.id="+stravaAccount.id);
    //                 //const sa = require("../queue/strava-api-getWorkoutsAndStoreInDatabase"); 
    //                 //sa.getWorkoutsAndStoreInDatabase(stravaAccount, 1);
    //                 //Strava queue up harvest
    //                 //const str = require("../queue/strava-job-activitySync");
    //                 //str.enqueue(stravaAccount);
    //                 //const str = require("../queue/strava-job-subscribeWebhook");
    //                 //str.enqueue(stravaAccount);
    //                 const str = require("../queue/strava-job-getSingleActivity");
    //                 str.enqueue(stravaAccount, 6656198544);
    //             } else {
    //                 console.log(__filename+" no stravaAccount found for stravaAccountId="+getStravaAccountId);
    //             }
    //         },
    //         err => {console.log("/misc.js error "+err.message);}
    //     )
    // } catch (err) {
    //     console.log("/api/misc error #2");
    //     console.log(err);
    //     res.statusCode = 401
    //     res.send("FAIL DERP")
    // }

    //Google Maps Static API
    try{

        //https://maps.googleapis.com/maps/api/staticmap?key=AIzaSyB59IXLwloEoHPDsfcaySxMZgZgzRmfV8o&size=640x640&path=weight:7%7Ccolor:blue%7Cenc:em_mEfhzaONZHHj@Fz@AP@JB?xFAtAEt@BfCCt@@TEl@@jAEfC@nEEbCBd@QlF@p@j@~DRlBH^@TELWXe@VwDjC\\fCCb@MRO?]VOFa@`@MHa@Dg@Eq@IaEa@}Ca@iD]aAOu@GiASc@MiBu@gBaAeBcB{@aAuB_DUe@KUE[Wg@h@t@|B|DpAdBd@f@bAz@lBhAfAd@dB`@|@D`ATj@@|@TfBR\\J|@JR?h@HpADr@CZDn@NDFRJL@f@?b@ILKh@m@`@QCkADa@OgAXyAh@IdCy@X]@UBCEGAUI}@_@qBQsA?S?{AJkENcTIW@k@Ec@By@?[@O?e@BUCg@BoAAi@@}AAg@?OMAa@BIC{@DQGESQc@
        //Note: have had issues in some encodings and need to replace \\ with \ as per: https://gis.stackexchange.com/questions/83550/google-maps-decoded-polylines-showing-up-incorrectly
        var enc_polyline = 'im_mE|gzaOJXRV\\JP@fA?LFApC@bAMpN@^CfAFr@Ex@@^MzH@JMhEJvALv@Jz@j@~C@PGTONc@JaEfC^xCCZEL_@Zu@VQHKL]NS@_@CaD_@gBOyB[iD]eAOQBgCg@gCkAi@[}AeA_AaAeB{B{@uA_@kAy@mAh@r@hCpEp@|@j@r@r@p@f@b@lAv@l@Zx@^j@PJ?b@N\\Fl@@f@HLAn@FrAVlAPZFNFbEVz@Az@HZ?XBf@@XCZUdA[DQ?KOo@Ko@GQGq@`AsATMpDqAE@@[w@yFUsB@mAF}CAcCBc@?uCFu@?oABOEe@HWCe@@_ABMAYDmAAg@@UAaA@OCc@Bg@Ae@DeBCc@DsAAOIKy@?QBi@GOQQc@'
        const response = await axios.get('https://maps.googleapis.com/maps/api/staticmap?'+
        'path=weight:7%7Ccolor:blue%7Cenc:'+enc_polyline+
        '&key='+process.env.GOOGLE_MAPS_API_KEY+
        '&size=400x400',  
            { 
                responseType: 'stream'
            }
        );

        if (response && response.data){
            console.log(JSON.stringify(response.config));
            console.log(response.headers)
            const localFilePath = process.env.GOOGLE_MAPS_LOCAL_TEMP_PATH+'googlemap.png';
            const w = response.data.pipe(fs.createWriteStream(localFilePath));
            w.on('finish', () => {
                console.log('Successfully downloaded file!');

                //Now let's save to S3, yo
                require('../util/s3').uploadFile(localFilePath, 'googlemap.png');
                //console.log('/misc seems to have uploaded to s3');

            });
        }

    } catch (err){
        console.error(err);
    }



    res.set('Content-Type', 'application/json');
    return res.send({message: 'ok' })
};
