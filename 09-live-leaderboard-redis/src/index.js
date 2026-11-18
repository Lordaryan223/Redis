import express from "express"
import Redis from "ioredis"

const app=express();
app.use(express.json())

const redis= new Redis(process.env.REDIS_URL || 'redis://localhost:6379 ')

app.post("/post/view",async(req,res)=>{
    const {id}=req.body
    const totalView= await redis.incr(`post:${id}:views`)

    res.json({
        message:"view increased",
        id:"id",
        totalView
    })

})


app.post("/leaderboard/score", async(req,res)=>{
    const {playerId,name,email,score}= req.body
    await redis.hset(`player:${playerId}`,{name,email})
    const leaderboard=await redis.zincrby("leaderboard",score,playerId)
    res.json({message:"rank updated",playerId,name,email,leaderboard})
    })

app.get("/leaderboard",async(req,res)=>{

    const players = await redis.zrevrange("leaderboard", 0, 9, "WITHSCORES");
    if(players.length===0){
        res.json({message:"no user found"})
        return 
    }
   const users=[]
    for (let i=0;i<players.length;i+=2){
        const playerId=players[i]
        const score=Number(players[i+1])
        const details=await redis.hgetall(`player:${playerId}`)
        users.push({playerId,score,...details})  
    }

 res.json(users)

})

app.get("/leaderboard/:playerId/rank", async(req,res)=>{
    const {playerId}= req.params;
    const topRank=await redis.zrevrank("leaderboard",playerId)
    const rank=topRank===null?!null:topRank+1;
    res.json({playerId,rank})

})


 app.listen(3000,()=>{
        console.log("server is running at ", 3000)
    })
