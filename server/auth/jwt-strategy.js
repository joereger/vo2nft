const passport = require("passport")
const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
const db = require('../models/index.js');

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.JWT_SECRET

// Used by the authenticated requests to deserialize the user,
// i.e., to fetch user details from the JWT.
passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    // Check against the DB only if necessary.
    // This can be avoided if i don't want to fetch user details in each request.
    try{
        const User = db.sequelize.models.User;
        const user =  User.findOne({
            where: {
              id: jwt_payload._id
            }
        });
        if (err) {
            return done(err, false)
        }
        if (user) {
            return done(null, user)
        } else {
            return done(null, false)
            // or you could create a new account
        }
    } catch (error){
        console.error('JWT-strategy failed: ', error);
        return done(null, false)
    }
  })
)