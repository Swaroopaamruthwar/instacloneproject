const express = require('express');
const mongoose = require('mongoose');
const dotenv=require("dotenv")
const jwt = require('jsonwebtoken');
const loginRoutes = require("./routes/Auth")
const postRoutes = require("./routes/posts")

const app = express(); // creates a new express application
const cors = require('cors')
dotenv.config({path:'./config.env'});
mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("DB connected successfull!"))
.catch((err)=>{
    console.log(err)
});


app.use("posts",(req,res,next)=>{
    console.log(req.headers.authorization)
    var token = req.headers.authorization.split("Bearer ")[1];
    console.log(token)
    if(!token){
        return res.status(401).json({
            status:"failed",
            message:"token is missing"
        })
    }
    jwt.verify(token,process.env.SECRET,function(err,decoded){
        if(err){
            return res.status(401).json({
                status:"failed",
                message:"invalid token"
            })
        }
        else{
            req.user = decoded.data
            next();
        }
    })
})


app.use(cors())
app.use("/",loginRoutes)
app.use("/",postRoutes)

app.listen(process.env.PORT ||5000,()=>{  
    console.log(`Server is responding 5000`);
})
