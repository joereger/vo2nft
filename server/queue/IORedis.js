const Redis = require('ioredis');

console.log("process.env.REDIS_URL="+process.env.REDIS_URL);
const redis_connection = new Redis(process.env.REDIS_URL);
