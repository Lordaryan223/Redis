import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

const app=express()
const url=process.env.MONGO_URL||'mongodb://localhost:27017/redistest'

const redis =new Redis(process.env.REDIS_URL|| 'redis://localhost:6379')

app.get('/redis',async(req,res)=>{
    const reply = await redis.ping()
    res.json({ redis: reply })
}
)

app.get('/mongo',async(req,res)=>{
    if(mongoose.connection.readyState===0){
        await mongoose.connect(url)
    }
    res.json({mongo:"connected", database:mongoose.connection.name})

})

app.listen(3000,()=>{
    console.log(`server is running on port ${process.env.PORT||3000}`)
})






