var url = require('url');
const Redis = require('ioredis');
const REDIS_URL = process.env.REDIS_URL;
const redis_uri = url.parse(REDIS_URL);

console.log("redis-client.js start");

//Handle SSL options if we're running on a redis server that requires SSL/TLS
const redisOptions = REDIS_URL.includes("rediss://")
? {
        port: Number(redis_uri.port),
        host: redis_uri.hostname,
        password: redis_uri.auth.split(":")[1],
        db: 0,
        tls: {
            rejectUnauthorized: false,
        },
        maxRetriesPerRequest: null, 
        enableReadyCheck: false
    }
: REDIS_URL;

//Now create the actual redis instance
var redis_client = null;
if (REDIS_URL.includes("rediss://")){
    redis_client = new Redis(redisOptions);
} else {
    redis_client = new Redis(REDIS_URL, {maxRetriesPerRequest: null, enableReadyCheck: false});
}

console.log("redis-client.js end");

module.exports = redis_client;