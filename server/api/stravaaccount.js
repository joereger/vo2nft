const db = require('../models/index.js');
var util = require('util')
const { Op } = require("sequelize");

exports.stravaaccount = async function(req, res){
    console.log('/api/stravaaccount called');


    


    res.set('Content-Type', 'application/json');
    return res.send("StravaAccount")
};
