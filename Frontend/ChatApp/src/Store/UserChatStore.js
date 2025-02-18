import {create} from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"
import { UserAuthStore } from "./UserAuthStore"

export const UserChatStore = create((set,get)=>({
    users :[],
    messages :[],
    selectedUser : null,
    isUsersLoading:false,
    isMessagesLoading:false,
    

    getUsers : async () => {
        set({isUsersLoading:true})
        try {
            const res = await axiosInstance.post('/messages/usersall')
            set({users:res.data})

        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        } finally {
            set({isUsersLoading:false})
        }
    },

    getMessages : async (userID) =>{
        set({isMessagesLoading:true})
        try {
            const res = await axiosInstance.post(`/messages/${userID}`)
            set({messages:res.data})
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        } finally{
            set({isMessagesLoading:false})
        }
    },
    
    sendMessage : async (messageData) => {

        const {messages,selectedUser} = get()
        
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData)
            set({messages:[...messages,res.data]})

        } catch (error) {
            toast.error(error.response.data.message)
        } 

    },

    subscribeToMessages : ()=>{
        const selectedUser = get()
        if(!selectedUser) return

        const socket = UserAuthStore.getState().socket

        socket.on("newmessage",(message)=>{
            
            if(message.senderID !== selectedUser.selectedUser._id )  return

            
            set({messages : [...get().messages,message]})

        })

    },

    unSubscribeToMessages : ()=>{
        const socket = UserAuthStore.getState().socket

        socket.off('newmessage')
    },

    setSelectedUser : (user) => set({selectedUser:user})
    ,

}))