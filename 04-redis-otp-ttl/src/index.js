import express from "express";
import Redis from "ioredis";

const app=express()
app.use(express.json())

const redis =new Redis(process.env.REDIS_URL|| 'redis://localhost:6379')


function otpKey(phone){
    return `otp:${phone}`
}
app.post('/otp',async(req,res)=>{
    const {phone}=req.body
    const otp=String(Math.floor(1000+Math.random()*9000))
    await redis.set(otpKey(phone),otp,'EX',60)// set the otp with a TTL of 60 seconds jo otpkey(phone) me actual otp store karega aur 60 seconds ke baad expire ho jayega

    res.json({success:true, message:`OTP sent to ${phone}`, otp})
})

app.post('/otp/verify',async(req,res)=>{
    const {phone,otp}=req.body
    const exists=await redis.exists(otpKey(phone))
    if(exists){
        const storedOtp=await redis.get(otpKey(phone))
        if(storedOtp===String(otp)){
            await redis.del(otpKey(phone));
            res.json({message:"OTP verification successful"})

        }else{
            res.json({message:"OTP verification failed"})   

         }
    }else{
        res.json({message:"OTP does not exists or has expired"})
    }
})

app.get('/otp/:phone/ttl',async(req,res)=>{
    const {phone}=req.params
    const exists= await redis.exists(otpKey(phone))
    const ttl= await redis.ttl(otpKey(phone))
    if(exists){
        
        res.json({message:"OTP exists",ttl})
    }
    else{
        res.json({message:"OTP does not exist",ttl})
    }
}
)

app.listen(3000,()=>{
    console.log(`server is running at port ${process.env.PORT||3000}`)
})