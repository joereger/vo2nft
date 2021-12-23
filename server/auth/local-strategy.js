const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const db = require('../models/index.js')
const User = db.sequelize.models.User;

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
