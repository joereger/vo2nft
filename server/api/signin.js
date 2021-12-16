const db = require('../models/index.js');

exports.signin = async function(req, res){
    console.log('/api/signin called in signin.js email='+req.body.email);

    //Email can't be blank
    if (req.body.email==null || req.body.email==''){
        console.log('Email cannot be blank'); 
        res.set('Content-Type', 'application/json');
        return res.send(400, { message: "Doh, the email can't be blank." });
    }

    //Find this user
    try {
        const User = db.sequelize.models.User;
        const user =  User.findOne({
            where: {
              email: req.body.email
            }
        });
        if(user === null){
            console.log("Signup.js no User found for email "+req.body.email);
            res.set('Content-Type', 'application/json');
            return res.send(400, { message: "Sorry, user not found or password incorrect.  Please try again." });
        } else {
            //Verify password
            if (user.password != req.body.password){
                console.log("Signup.js password not correct for email:"+req.body.email+" password:"+req.body.password);
                res.set('Content-Type', 'application/json');
                return res.send(400, { message: "Sorry, user not found or password incorrect.  Please try again." });
            } else {

            }
        }
        
    } catch (error){
        console.error('Signin failed: ', error);
        res.set('Content-Type', 'application/json');
        return res.send(500, { message: "Durn, an unspecified server error has occurred.  This isn't your fault.  Please try again." });
    }
    
    res.set('Content-Type', 'application/json');
    res.send('{"message":"Signin Successful"}');
};