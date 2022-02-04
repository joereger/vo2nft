const { Queue, FlowProducer } = require('bullmq');
const Redis = require('ioredis');
let redis_client = new Redis(process.env.REDIS_URL, {maxRetriesPerRequest: null, enableReadyCheck: false});
const workQueue = new Queue('testqueue', { connection: redis_client });

exports.submitFakeJob = () => {
    console.log("test-queue.js submitFakeJob() called");
    let job = workQueue.add('test', { colour: 'red' }).then((job) => {
        console.log("job.id="+job.id);
    }).catch((error) => {
        console.error(error);
    });

}

exports.submitFlow = () => {
    console.log("test-queue.js submitFlow() called");   
    const flowProducer = new FlowProducer({ connection: redis_client });

    const flow = flowProducer.add({
        name: 'testQueueComplete',
        queueName: 'testQueueComplete',
        data: {stravaId: 'DONE', userId: 4},
        children: [
            { name: 'testActivity', queueName: 'testActivity', data: { stravaId: 'dsfsd', userId: 2, accessToken: 'fsdsdf' } },
            { name: 'testActivity', queueName: 'testActivity', data: { stravaId: 'fdgrrw', userId: 2, accessToken: 'fsdsdf' } },
            { name: 'testActivity', queueName: 'testActivity', data: { stravaId: '44frefrew', userId: 2, accessToken: 'fsdsdf' } },
            { name: 'testActivity', queueName: 'testActivity', data: { stravaId: '4f34f', userId: 2, accessToken: 'fsdsdf' } },
        ],
    });

}