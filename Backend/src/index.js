import express from 'express'
import dotenv from "dotenv"
import cors from "cors"
import authRouter from './Routes/auth.Route.js'
import mongoConnect from './Config/mongoose.js'
import cookieparser from "cookie-parser"
import {connectCloudinary} from './Config/Cloudinary.js'
import messagesRouter from './Routes/TextRouter.js'
import fileUpload from "express-fileupload"
import {app,server,io} from "./Config/Socket.js"
import path from "path"

dotenv.config()
const __dirname = path.resolve()
console.log("dirname::",__dirname)

app.use(express.json({ limit: "50mb" }))
app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, "*")
        callback(null, origin)
      },
      credentials: true, 
    })
  );
app.use(cookieparser())
app.use(fileUpload({useTempFiles:true}))


app.get('/',(req,res)=>{
    res.json('server working')
})

app.use('/api/user',authRouter)
app.use('/api/messages',messagesRouter)


  app.use(express.static(path.join(__dirname,'../Frontend/ChatApp/dist')))

  app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"../Frontend","ChatApp","dist","index.html"))
  })



server.listen(process.env.PORT,()=>{
    console.log(`server is listening at ${process.env.PORT}`)
    mongoConnect()
    connectCloudinary()
})