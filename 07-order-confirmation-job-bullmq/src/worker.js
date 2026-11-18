import { Worker } from "bullmq";
import connection from "./queue.js";

const worker=new Worker(
    "emails",
    async job=>{
        console.log("processing job...",job.id,job.data,job.name)
        (await new Promise(resolve=>setTimeout(resolve,1500)))
        console.log("job completed",job.id, job.data,job.name)
    },
    {connection},{
    limiter: {
      max: 10,       // Maximum jobs
      duration: 1000 // Per 1000 milliseconds
    }}
 
)
worker.on("completed",(job)=>{
console.log("job completed event fires", job.id, job.name, job.data)
})

worker.on("failed",(job,err)=>{
console.log("job failed event fires", job.id, job.name, job.data, err)
})

