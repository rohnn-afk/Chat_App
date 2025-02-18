import {create} from "zustand"
import {axiosInstance} from "../lib/axios.js"
import toast from "react-hot-toast"
import io from "socket.io-client"

const BASE_URL = "http://localhost:5000"

export const UserAuthStore = create((set,get)=>({
authUser:null,

isSigningIn:false,
isLoggingIn:false,
isUpdatingProfile:false,
isCheckingAuth:true,
onlineUsers : [],
socket:null,

checkAuth: async()=>{
    try {
        const res = await axiosInstance.get('/user/check')

        set({authUser:res.data})
        get().connectSocket()

    } catch (error) {
        console.log('error at authstore checking auth',error)
        set({authUser:null})
    }finally{
        set({isCheckingAuth:false})
    }
},

Signup : async (data)=>{
    set({isSigningIn:true});
    try {
        const res = await axiosInstance.post('/user/signup',data)
        if(res.data.success){
        set({authUser:res.data.User})
        get().connectSocket()
        toast.success('User successfully created')
        }
    } catch (error) {
        toast.error(error.response.data.message)
    } finally {
        set({isSigningIn:false})
    }
},

Logout : async () =>{
    try {
        const res = await axiosInstance.post('/user/logout')
        if(res.data.success){
            toast.success('User Logged-Out')
            set({authUser:null})
            get().disconnectSocket()
        }
    } catch (error) {
        toast.error(error.response.data.message)
    }
},

Login : async (data) =>{

    set({isLoggingIn:true})
    try {
        const res = await axiosInstance.post('/user/login',data)

        if(res.data.success){
            toast.success('User Logged-In')
            set({authUser:res.data.User})
            get().connectSocket()
        }
    } catch (error) {
        toast.error(error.response.data.message)
        console.log(error)
    } finally {
        set({isLoggingIn:false})
    }
},

UpdateProfile : async (data) =>{
    set({isUpdatingProfile:true})
    
    try {
        const res = await axiosInstance.post('/user/updateuser', data)

        if(res.data.success){

            set({authUser:res.data.user})
           toast.success("profile updated")
        }

    } catch (error) {
        toast.error(error.response.data.message)
    } finally{
        set({isUpdatingProfile:false})
    }
},

connectSocket : ()=>{
    const {authUser} = get()
    if(!authUser || get().socket?.connected)  return

    const socket = io(BASE_URL,
    {
        query: { userId : authUser._id }
    })

    socket.connect()
    set({socket:socket})

    socket.on("onlineusers",(userIds)=>{
        set({onlineUsers:userIds})
    })
},

disconnectSocket : ()=>{
   if(get().socket?.connected) get().socket.disconnect()
}
}))