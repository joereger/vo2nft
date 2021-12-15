const db = require('../models/index.js');

exports.signup = function(req, res){
    console.log('/api/signup called in signup.js email='+req.body.email);

    //TODO this validation doesn't work.  it'll log out that passwords don't match before it logs out that the email doesn't appear to exist.  i need to make these synchronous

    //Email can't be blank
    if (req.body.email==null || req.body.email==''){
        //res.set('Content-Type', 'application/json');
        //res.send('{"message":"Email cannot be blank"}'); 
        console.log('Signup email cannot be blank'); 
        res.set('Content-Type', 'application/json');
        return res.send(400, { message: "Doh, the email can't be blank." });
    }

    //See if this email is already in use
    try {
        const User = db.sequelize.models.User;
        User.count({ where: { email: req.body.email } }).then(usercount => {
            if (usercount>0){ 
                console.log("Signup.js Email already exists "+req.body.email);
                res.set('Content-Type', 'application/json');
                return res.send(400, { message: "Oops, that email already exists.  Consider logging in instead?" });
            } else {
                console.log("Signup.js Email doesn't appear to exist:  "+req.body.email);    
            }  
        })
    } catch (error){
        console.error('Signup failed: ', error);
        res.set('Content-Type', 'application/json');
        return res.send(500, { message: "Durn, an unspecified server error has occurred.  This isn't your fault.  Please try again." });
    }
    

    //Verify that passwords match
    if (req.body.password!=req.body.confirmpassword){
        console.log("Signup: passwords don't match"); 
        res.set('Content-Type', 'application/json');
        return res.send(400, { message: "Whoopsie, looks like your passwords don't match.  Please try again." });    
    } else {
        console.log("Signup: passwords match");    
    }

    //Write new database record
    try {
        var passHash = "xxx"; //TODO implement Passport/password hashing
        const User = db.sequelize.models.User;
        User.create({ email: req.body.email, password_hash: passHash }, { fields: [ 'email', 'password_hash',  ] }).then(user => {
            //User is saved, can use it here
            console.log(user.get({
              plain: true
            }))
          })
    } catch (error){
        console.error('Signup failed: ', error);
        res.set('Content-Type', 'application/json');
        return res.send(500, { message: "Durn, an unspecified server error has occurred.  This isn't your fault.  Please try again." });
    }

    res.set('Content-Type', 'application/json');
    res.send('{"message":"Signup Successful"}');
};