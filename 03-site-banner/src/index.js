import express from "express";
import Redis from "ioredis";

import dotenv from "dotenv";

dotenv.config()
const PORT = process.env.PORT || 3000

const app=express()
app.use(express.json());
const url=process.env.MONGO_URL||'mongodb://localhost:27017/redistest'

const redis =new Redis(process.env.REDIS_URL|| 'redis://localhost:6379')

const BANNER_KEY = "app:banner";

app.post("/banner", async (req, res) => {
    const { message } = req.body;
  await redis.set(BANNER_KEY, message);
  res.json({ success: true });
});

app.get('/banner',async(req,res)=>{
    const message= await redis.get(BANNER_KEY)
    res.json({success:true, message})
})

app.delete('/banner',async(req,res)=>{
    await redis.del(BANNER_KEY)
    res.json({success:true, message:"banner deleted"})
})

app.get('/banner/exists',async(req,res)=>{
    const exists = await redis.exists(BANNER_KEY)
    res.json({success:true, exists:Boolean(exists)})
})

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})