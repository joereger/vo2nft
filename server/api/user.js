const db = require('../models/index.js');
var util = require('util')
const { Op } = require("sequelize");

exports.user = async function(req, res){
    console.log('/api/user/'+req.params.user_id+' called');

    var user = null;
    var user_stripped = null;
    // const user = await db.sequelize.models.User.findOne({ where: {
    //     username: req.params.username 
    // } });
    if (req.params.user_id && req.params.user_id>0){

        user = await db.sequelize.models.User.findOne({ where: {
            id: req.params.user_id  
        } });

        console.log("user = "+JSON.stringify(user));

        //Only send the data i want a public profile to see
        user_stripped = Object.assign({}, user.get());
        delete user_stripped.activation_key;
        delete user_stripped.reset_password_count;
        delete user_stripped.reset_password_key;
        delete user_stripped.refresh_token;
        delete user_stripped.password_hash;
        delete user_stripped.password_salt;
        delete user_stripped.reset_password_expiration;
        delete user_stripped.verified;
        delete user_stripped.email;
     

    }
    
    res.set('Content-Type', 'application/json');
    return res.send({user: user_stripped})
    
};

