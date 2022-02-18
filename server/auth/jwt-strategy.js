const passport = require("passport")
const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
const db = require('../models/index.js');

//import { inspect } from 'util'
//var util = require('util')

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.JWT_SECRET
opts.passReqToCallback = true  

// Used by the authenticated requests to deserialize the user,
// i.e., to fetch user details from the JWT.
passport.use(
  new JwtStrategy(opts, function (req, jwt_payload, done) {
    
    // console.log("jwt-strategy.js called");
    // console.log("jwt-strategy req="+req);
    // console.log(util.inspect(req));
    // console.log("jwt-strategy opts.jwtFromRequest="+opts.jwtFromRequest);
    // console.log("jwt-strategy jwt_payload="+jwt_payload);
    // console.log(util.inspect(jwt_payload))
    // console.log("jwt-strategy jwt_payload._id="+jwt_payload._id);
    // console.log("jwt-strategy done="+done);
    // Check against the DB only if necessary.
    // This can be avoided if i don't want to fetch user details in each request.
    try{
        const User = db.sequelize.models.User;
        const user = User.findOne({
            where: {
              id: jwt_payload._id
            }
        //}).then( () => {
        //  if (user) {
        }).then(
          user => {
          if (user) {
              //console.log("jwt-strategy found User.id="+user.id);
              return done(null, user)
          } else {
            console.log("jwt-strategy couldn't find user"); 
              return done(null, false)
              // or you could create a new account
          }
        }
        );
        // if (err) {
        //     return done(err, false)
        // }
        
    } catch (error){
        console.error('JWT-strategy failed: ', error);
        return done(null, false)
    }
  })
  
)