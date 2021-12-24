const db = require('../models/index.js');

exports.user = async function(req, res){
    console.log('/api/user called');
    res.set('Content-Type', 'application/json');
    return res.send(200, { message: "Thanks." });
};