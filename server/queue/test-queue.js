const { Queue } = require('bullmq');;
const Redis = require('ioredis');
let redis_client = new Redis(process.env.REDIS_URL);
const workQueue = new Queue('testqueue', { connection: redis_client });

exports.submitFakeJob = () => {
    console.log("test-queue.js submitFakeJob() called");
    let job = workQueue.add('test', { colour: 'red' }).then((job) => {
        console.log("job.id="+job.id);
    }).catch((error) => {
        console.error(error);
    });
}