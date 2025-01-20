import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import {CreateUserSchema,SigninSchema,CreateRoomSchema} from "@repo/common/types";
import {prismaClient} from "@repo/db/client"


const app=express();
const port = 3001;
app.use(express.json());

app.post("/signup",async (req,res)=>
{
      const parsedData=CreateUserSchema.safeParse(req.body);
    if(!parsedData.success){
         res.json({
            message:"Incorrect inputs"
        })
        return;
        
    }
    try{
    const user=await prismaClient.user.create({
        data:{
            email:parsedData.data?.username,
            //Todo: Hash the password
            password:parsedData.data.password,
            name:parsedData.data.name
        }
    })

//db call
res.json({
    userId:user.id
})
    } 
    catch(e){
        res.status(411).json({
            message:"User already exits with this username"
        })
    }


})

app.post("/signin",async (req,res)=>{
    const parsedData=SigninSchema.safeParse(req.body);
    if(!parsedData.success){
         res.json({
            message:"Incorrect inputs"
        })
        return;
        
    }
    //TODO :Compare the hashed pws here
    const user=await prismaClient.user.findFirst({
        where:{
            email:parsedData.data.username,
            password:parsedData.data.password
        }
    })
    if(!user){
        res.status(403).json({
            message:"Not Authorized"
        })
        return;
    }

   
    const token=jwt.sign({
        userId:user?.id
    },JWT_SECRET);
    res.json({
        token
    })

})
app.post("/room",middleware,async(req,res)=>{
    const parsedData=CreateRoomSchema.safeParse(req.body);
    if(!parsedData.success){
         res.json({
            message:"Incorrect inputs"
        })
        return;
        
    }
    //@ts-ignore: Todo:fix this
    const userId=req.userId;
    
    try{
    const room=await prismaClient.room.create({
        data:{
            slug:parsedData.data.name,
            adminId:userId
        }


    })
    res.json({
        roomId:room.id
    }) 
}
catch(e){
    res.status(411).json({
        message:"Room already exits with this name"
    })
}

})
app.get("/chats/:roomId",async (req,res)=>{
    const roomId=Number(req.params.roomId);
    const messages=await prismaClient.chat.findMany({
        where:{
            roomId:roomId
        },
        orderBy:{
            id:"desc"
        },
        take:50
    });
    res.json({
        messages
    })
})
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });