

exports.misc = async function(req, res){
    console.log('/api/misc called');

    //const tq = require("../queue/test-queue");
    //tq.submitFlow();

    const tq = require("../queue/strava-throttle");
    tq.recordApiCall();
    const apiCallsSoFarInCurrentFifteenMinuteBlock = await tq.apiCallsSoFarInCurrentFifteenMinuteBlock();
    const apiCallsSoFarToday = await tq.apiCallsSoFarToday();
    const millisUntilApiAvailable = await tq.millisUntilApiAvailable();
   
    res.set('Content-Type', 'application/json');
    return res.send({message: 'ok', apiCallsSoFarInCurrentFifteenMinuteBlock, apiCallsSoFarToday, millisUntilApiAvailable })
};
