import express from "express";

import emailQueue from "./queue.js";
const app=express()
app.use(express.json())

app.post("/emails",async(req,res)=>{
    const job= await emailQueue.add("send-email",{
        to:req.body.to,
       name:req.body.name || "User",
    },
    {
    attempts:3,
    backoff:{
        type:"exponential",
        delay:5000
    }
    }
    )
}
)
app.listen(3000,()=>{
    console.log(`server is running at port ${process.env.PORT||3000}`)
})


