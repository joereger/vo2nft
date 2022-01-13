const db = require('../models/index.js');
const jwt = require("jsonwebtoken");
const { getToken, COOKIE_OPTIONS, getRefreshToken } = require("../auth/authenticate");
const user = require('../models/user.js');

exports.logout = async function(req, res, next){
    console.log('/api/logout called');
    res.clearCookie("refreshToken");
    return res.send({ success: true });
};