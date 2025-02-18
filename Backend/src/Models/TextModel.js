import mongoose from "mongoose";

const TextSchema = new mongoose.Schema({
    senderID :{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
    recieverID :{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
    text:{
        type:String
    },
    Image:{
        type:String
    }
},{timestamps:true})


export const TextModel = new mongoose.model('Messages',TextSchema) 