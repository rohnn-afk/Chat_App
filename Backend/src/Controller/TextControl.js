import { uploadCloudImageMessages } from "../Config/Cloudinary.js"
import { getRecieverSocketId, io } from "../Config/Socket.js"
import { TextModel } from "../Models/TextModel.js"
import UserModel from "../Models/UserModel.js"

export const getAllUsers = async (req,res) => {

    try {
        
        const userID = res.user._id
        const allUser = await UserModel.find({_id : {$ne: userID}}).select("-password")

        return  res.status(200).json(allUser)

    } catch (error) {
        console.error("error at alluser chat",error.message)
        return  res.status(500).json({error:"Internal server error at fetching chat users"})
    }
}

export const getMessages = async (req,res) => {
    try {
        const {id:userToChatId} = req.params
        const userID = res.user._id

        const messages = await TextModel.find({
            $or:[{
                senderID: userID,recieverID: userToChatId},{
                senderID:userToChatId,recieverID:userID
            }]})

            return res.status(202).json(messages)
        
    } catch (error) {
        console.error('error at getmessages',error)
        return  res.status(500).json({error:"Internal server error at get messages"})
    }
}


export const sendMessage = async(req,res) =>{
    try {
        
        const {id:recieverID} = req.params
        const senderID = res.user._id


        const text = req.body.text
        const image = req.files?.image

        let imageURL

        if(image){
            imageURL = await uploadCloudImageMessages(image)
        }

   
        const newMessage = new TextModel({
            senderID,
            recieverID,
            text:text,
            Image:imageURL
        })

        await newMessage.save()

        //todo: socketio for real timw

        const socketId = getRecieverSocketId(recieverID)

        if(socketId){
            io.to(socketId).emit("newmessage",newMessage)
        }

        return res.status(201).json(newMessage)

    } catch (error) {
        console.log(error)
        console.error('error at sending messages',error.message)
        return  res.status(500).json({error:"Internal server error at sending messages"})
    }
}