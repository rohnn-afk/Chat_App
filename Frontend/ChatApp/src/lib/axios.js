import axios from "axios"

export const axiosInstance = axios.create({
    baseURL:'https://chat-app-7hpc.onrender.com',
    withCredentials:true
}) 