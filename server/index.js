const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

//const Sequelize = require('sequelize');
//const { Sequelize, DataTypes, Model } = require('sequelize');
//const dbConfig = require('./config/config.json');
const db = require('./models/index.js');

// console.log(`dbConfig:`+ JSON.stringify(dbConfig, null, 2));
// console.log('process.env.NODE_ENV: '+process.env.NODE_ENV)

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5001;

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

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

  try {
    const User = db.sequelize.models.User;
    //const jane = User.create({ email: "jane@jane.com", password_hash: 'aaaaaaa' });
    console.log('User.id='+ User.id);
  } catch (error){
    console.error('Failed User insert: ', error);
  }
  
  //Use to reset db, only in development, destructive operation
  //console.log('SEQUALIZE START force sync() db schema');
  //db.sequelize.sync({ force: true });
  //console.log('SEQUALIZE END force sync() db schema');



  // Answer API requests.
  app.get('/api', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send('{"message":"Hello from the custom backend Node server!"}');
  });

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
  });

  app.listen(PORT, function () {
    console.error(`Node ${isDev ? 'dev server' : 'cluster worker '+process.pid}: listening on port ${PORT}`);
  });
}
