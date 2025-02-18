import {Server} from "socket.io"
import express from "express"
import http from "http"

const app = express()
const server = http.createServer(app)

const io = new Server(server,{
    cors: {origin: "*",}
})

export function getRecieverSocketId(userId) {

    return onlineUsers[userId]

}


const onlineUsers = {}

io.on("connection",(socket)=>{
    // console.log("a new connection made",socket.id)
    
    const userId = socket.handshake.query.userId

    if(userId) onlineUsers[userId] = socket.id

    io.emit("onlineusers",Object.keys(onlineUsers))

    socket.on("disconnect",()=>{    
        // console.log("A user disconnected",socket.id)
        delete onlineUsers[userId]
        io.emit("onlineusers",Object.keys(onlineUsers))
    })

})


export {io , app ,server}