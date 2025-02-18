import express from "express"
import { UserAuth } from "../Middleware/UserAuth.js"
import { getAllUsers, getMessages, sendMessage } from "../Controller/TextControl.js"

const messagesRouter = express.Router()

messagesRouter.post('/',(req,res)=>{
    res.json('working message')
})

messagesRouter.post('/usersall',UserAuth,getAllUsers)
messagesRouter.post('/:id',UserAuth,getMessages)
messagesRouter.post('/send/:id',UserAuth,sendMessage)

export default messagesRouter