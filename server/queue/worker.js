//let throng = require('throng');
const { Worker } = require('bullmq');
const Redis = require('ioredis');
let redis_client = new Redis(process.env.REDIS_URL);

var start = exports.start = () => {

    console.log("worker.js START called");

    const worker = new Worker('testqueue', async (job) => {
        console.log("STARTING job.id="+job.id+" job.name="+job.name+" job.queueName="+job.queueName);


        // This is an example job that just slowly reports on progress
        // while doing no work. Replace this with your own job logic.
        let progress = 0;

        // throw an error 5% of the time
        if (Math.random() < 0.05) {
            console.log("ERROR job.id="+job.id);
            throw new Error("This job failed!")
        }

        while (progress < 100) {
            console.log("PROGRESS job.id="+job.id+" progress="+progress);
            await new Promise(r => setTimeout(r, 50));
            progress += 1;
            job.updateProgress(progress)
        }

        // A job can return values that will be stored in Redis as JSON
        // This return value is unused in this demo application.
        console.log("DONE job.id="+job.id);
        return "This will be stored" ;
    }, { connection: redis_client, concurrency: 50 } );
 
}

var startFlowWorkers = exports.startFlowWorkers = () => {
    console.log("worker.js startFlowWorkers called");

    const worker = new Worker('stravaActivitySyncComplete', async (job) => {
        console.log("STARTING stravaActivitySyncComplete job.id="+job.id+" job.name="+job.name+" job.queueName="+job.queueName);

        console.log("DONE DONE DONE stravaActivitySyncComplete job.id="+job.id);
        return "done" ;
    }, { connection: redis_client, concurrency: 50 } );



    const worker2 = new Worker('stravaGetActivity', async (job) => {
        console.log("STARTING stravaGetActivity job.id="+job.id+" job.name="+job.name+" job.queueName="+job.queueName+" data="+JSON.stringify(job.data));

        // This is an example job that just slowly reports on progress
        // while doing no work. Replace this with your own job logic.
        let progress = 0;

        // throw an error 5% of the time
        if (Math.random() < 0.05) {
            console.log("ERROR stravaGetActivity job.id="+job.id);
            throw new Error("This job failed!")
        }

        while (progress < 100) {
            console.log("PROGRESS stravaGetActivity job.id="+job.id+" progress="+progress);
            await new Promise(r => setTimeout(r, 50));
            progress += 1;
            job.updateProgress(progress)
        }

        // A job can return values that will be stored in Redis as JSON
        // This return value is unused in this demo application.
        console.log("DONE stravaGetActivity job.id="+job.id);
        return "This will be stored" ;
    }, { connection: redis_client, concurrency: 50 } );

    
 
}

//TODO this *may* be firing up two workers, each with 50 concurrency, not sure
console.log("worker.js about to call start() function");
start();

// Initialize the clustered worker process
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
// const start = require('./worker.js');
//const workers = 2;
//throng({ workers, start });