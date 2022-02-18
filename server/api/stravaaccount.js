const db = require('../models/index.js');
var util = require('util')
const { Op } = require("sequelize");

exports.stravaaccount = async function(req, res){
    console.log('/api/stravaaccount called');
    console.log('/api/stravaaccount req.user.id='+req?.user?.id);

    const StravaAccount = db.sequelize.models.StravaAccount;
    const stravaAccount = await StravaAccount.findOne({
        where: {
            userId: req.user.id
        }
    })

    if (stravaAccount && stravaAccount.id > 0){
        res.set('Content-Type', 'application/json');
        return res.send(stravaAccount)    
    }
    
    res.set('Content-Type', 'application/json');
    return res.send({message: "Strava Account not found."})
};

exports.stravaaccountdisconnect = async function(req, res){
    console.log('/api/stravaaccountdisconnect called');
    console.log('/api/stravaaccountdisconnect req.user.id='+req?.user?.id);

    const StravaAccount = db.sequelize.models.StravaAccount;
    const stravaAccount = await StravaAccount.findOne({
        where: {
            userId: req.user.id
        }
    })

    if (stravaAccount && stravaAccount.id > 0){

        stravaAccount.auth_token = null;
        stravaAccount.auth_token_expires_at = null;
        stravaAccount.refresh_token = null;
        await stravaAccount.save();

        res.set('Content-Type', 'application/json');
        return res.send({message: "Strava Account disconnected."})   
    }
    
    res.set('Content-Type', 'application/json');
    return res.send({message: "Strava Account not found."})
};
