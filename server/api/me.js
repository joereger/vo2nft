const db = require('../models/index.js');

exports.me = async function(req, res){
    console.log('/api/me called');
    res.set('Content-Type', 'application/json');
    return res.send(req.user)
};