//VEE OH TWO ENN EFF TEE
//
//If in dev, dotenv to read .env into environment vars
if (process.env.NODE_ENV !== 'production') {
  // Load environment variables from .env file in non-prod environments
  require("dotenv").config()
}
require('newrelic');
console.log("\u001B[46m \u001B[30m>>>>>>>>>> VO2NFT SERVER ROARING TO LIFE <<<<<<<<<<\u001B[0m");
const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const passport = require("passport");
var http = require('http');
var enforce = require('express-sslify');

//Auth
const cors = require("cors")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")


//Environment
const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5001;
//console.log("NODE VERSION="+JSON.stringify(process.versions));


//If in dev, light up worker process.  In prod will use Heroku worker processes.
//if (process.env.NODE_ENV !== 'production') {
    const workers = require("./queue/strava-worker");
//}


//Auth Whitelist Domains
const whitelist = process.env.WHITELISTED_DOMAINS
  ? process.env.WHITELISTED_DOMAINS.split(",")
  : []

// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
  console.error(`Node production cluster master ${process.pid} is running`);
  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });
} else {
  console.error(`Node development pid ${process.pid} is running`);
  const app = express();

  //Force SSL in prod
  if (process.env.NODE_ENV === 'production') {
    // Use enforce.HTTPS({ trustProtoHeader: true }) in case you are behind
    // a load balancer (e.g. Heroku). See further comments below
    console.log("FORCING HTTPS");
    app.use(enforce.HTTPS({ trustProtoHeader: true }));
  }

  //Middleware
  app.use(express.json()); 
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser(process.env.COOKIE_SECRET))

  //Auth CORS
  const corsOptions = {
    origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
  }
  app.use(cors(corsOptions))

  const {
    getToken,
    COOKIE_OPTIONS,
    getRefreshToken,
    verifyUser,
  } = require("./auth/authenticate")

  require("./auth/authenticate")
  require("./auth/jwt-strategy")
  require("./auth/local-strategy")
  app.use(passport.initialize())
  
  // Priority serve any static files, specifically the React-UI frontend
  app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

  //API Routes
  app.post('/api/signup', require('./api/signup.js').signup);
  app.post('/api/login', passport.authenticate("local"), require('./api/login.js').login);
  app.get('/api/logout', require('./api/logout.js').logout);
  app.post('/api/refreshtoken', require('./api/refreshtoken.js').refreshtoken);
  app.post('/api/forgotpassword', require('./api/forgotpassword.js').forgotpassword);
  app.post('/api/resetpassword', require('./api/resetpassword.js').resetpassword);
  app.post('/api/strava_convert_code_to_access_token', require('./api/stravaconvertcodetoaccesstoken.js').strava_convert_code_to_access_token);
  app.post('/api/changepassword', verifyUser, require('./api/changepassword.js').changepassword);
  app.get('/api/me', verifyUser, require('./api/me.js').me);
  app.post('/api/me', verifyUser, require('./api/me.js').meUpdate);
  app.get('/api/stravawebhook', require('./api/stravawebhook.js').stravawebhookvalidation);
  app.post('/api/stravawebhook', require('./api/stravawebhook.js').stravawebhook);
  app.post('/api/misc', require('./api/misc.js').misc);

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
  });

  //Listen to the ports, not the ships in the sea; silly goose
  // app.listen(PORT, function () {
  //   console.error(`Node ${isDev ? 'dev server' : 'cluster worker '+process.pid}: listening on port \u001b[33m${PORT}\u001b[0m bring it`);
  // });
  http.createServer(app).listen(PORT, function() {
    console.log(`Node ${isDev ? 'dev server' : 'cluster worker '+process.pid}: listening on port \u001b[33m${PORT}\u001b[0m bring it`);
  });



}
