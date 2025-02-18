import express from "express"
import { checkAuth, login, logout, signup, updateUser } from "../Controller/LoginControl.js"
import { UserAuth } from "../Middleware/UserAuth.js"

const authRouter = express.Router()

authRouter.post('/signup',signup)

authRouter.post('/login',login)

authRouter.post('/logout',logout)

authRouter.post('/updateuser',UserAuth,updateUser)

authRouter.get('/check',UserAuth,checkAuth)

export default authRouter