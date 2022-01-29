const { Queue, FlowProducer } = require('bullmq');
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

exports.submitFlow = () => {
    console.log("test-queue.js submitFlow() called");   
    const flowProducer = new FlowProducer({ connection: redis_client });

    const flow = flowProducer.add({
        name: 'stravaActivitySyncComplete',
        queueName: 'stravaActivitySyncComplete',
        data: {stravaId: 'DONE', userId: 4},
        children: [
            { name: 'stravaGetActivity', queueName: 'stravaGetActivity', data: { stravaId: 'dsfsd', userId: 2, accessToken: 'fsdsdf' } },
            { name: 'stravaGetActivity', queueName: 'stravaGetActivity', data: { stravaId: 'fdgrrw', userId: 2, accessToken: 'fsdsdf' } },
            { name: 'stravaGetActivity', queueName: 'stravaGetActivity', data: { stravaId: '44frefrew', userId: 2, accessToken: 'fsdsdf' } },
            { name: 'stravaGetActivity', queueName: 'stravaGetActivity', data: { stravaId: '4f34f', userId: 2, accessToken: 'fsdsdf' } },
        ],
    });

}