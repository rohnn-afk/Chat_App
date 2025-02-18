import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()


export const createToken = (id,res)=>{
     const token =  jwt.sign({id},process.env.JWT_SECRET_KEY,{expiresIn:'7d'})

     res.cookie('jwt',token,{
        httpOnly:true,
        sameSite:'strict',
        secure : process.env.NODE_ENV !== 'development'
     })

     return token
}