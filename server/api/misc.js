

exports.misc = async function(req, res){
    console.log('/api/misc called');

    const tq = require("../queue/test-queue");
    tq.submitFakeJob();

    res.set('Content-Type', 'application/json');
    return res.send({message: 'ok'})
};
