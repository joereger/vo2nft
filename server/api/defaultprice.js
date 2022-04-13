const db = require('../models/index.js');
const { getToken, COOKIE_OPTIONS, getRefreshToken } = require("../auth/authenticate");
const user = require('../models/user.js');
var util = require('util')

exports.defaultprice = async function(req, res, next){
    console.log('/API/DEFAULTPRICE: req.body='+JSON.stringify(req.body));
    console.log('/API/DEFAULTPRICE: req.user='+JSON.stringify(req.user));
    console.log('/API/DEFAULTPRICE: req.body.default_price_in_eth='+req.body.default_price_in_eth);
    try {   
        const user = await db.sequelize.models.User.findOne({
            where: {
                id: req.user.id
            }
        });
        // console.log("START LOGGING USER");
        // console.log(util.inspect(user));
        // console.log("END LOGGING USER");
        if (user) {
            console.log("/API/DEFAULTPRICE: found user where id="+user.id);
            user.default_price_in_eth = req.body.default_price_in_eth;
            await user.save();
            console.log("/API/DEFAULTPRICE: user saved!");
            return res.send({ message: "Success!", user: user })

        } else {
            console.log("/API/CHANGEPASSWORD: user not found");
            res.set('Content-Type', 'application/json');
            return res.send(404, { message: "User not found" });
        }
    } catch (err) {
        console.log("/api/changepassword error #1");
        console.log(err);
        res.set('Content-Type', 'application/json');
        return res.send(500, { message: "I'm sorry, an unspecified server error has occurred.  This isn't your fault.  Please try again." });
    }

    //return res.send({ message: "Success!" })
};