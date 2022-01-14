const db = require('../models/index.js');
const { getToken, COOKIE_OPTIONS, getRefreshToken } = require("../auth/authenticate")

exports.signup = async function(req, res){
    console.log('/api/signup called in signup.js email='+req.body.email);

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
        usercount = await User.count({ where: { email: req.body.email } });
        
        //.then(usercount => {
            if (usercount>0){ 
                console.log("Signup.js Email already exists "+req.body.email);
                res.set('Content-Type', 'application/json');
                return res.send(400, { message: "Oops, that email already exists.  Consider logging in instead?" });
            } else {
                console.log("Signup.js Email doesn't appear to exist:  "+req.body.email);    
            }  
        //})
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

    //Register with auth strategies using User.register(var1=user, var2=password, var3=function)
    try {

        const User = db.sequelize.models.User;
        await User.register(
            User.build({ email: req.body.email, username: req.body.username }),
            req.body.password,
            (err, user) => {
              if (err) {
                //Error in auth framework FML
                console.error("signup.js[error #1] "+JSON.stringify(err, ["message", "arguments", "type", "name", "stack"]));
                res.set('Content-Type', 'application/json');
                return res.send(500, { message: "Durn, an unspecified server error has occurred.  This isn't your fault.  Please try again." });
              } else {

                //Generate a refresh token and save it on user
                const token = getToken({ _id: user.id })
                const refreshToken = getRefreshToken({ _id: user.id })
                user.refresh_token = [refreshToken];
                user.name = req.body.name;
                user.username = req.body.username;
                user.save();

                //Respond to client including refreshToken as cookie
                res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
                return res.send({ message: "Yay!  Signup was successful!", success: true, token, user: user })
              }
            }
          )

    } catch (error){
        console.log('Signup failed: DEBUG #5', error);
        res.set('Content-Type', 'application/json');
        return res.send(500, { message: "Durn, an unspecified server error has occurred.  This isn't your fault.  Please try again." });
    }

};