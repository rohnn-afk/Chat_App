import { uploadCloudImage } from "../Config/Cloudinary.js"
import { createToken } from "../Middleware/TokenMaker.js"
import UserModel from "../Models/UserModel.js"
import bcrypt from "bcryptjs"


export const signup = async (req,res) =>{
    
    const {email , fullname , password } = req.body 

    try {
        if(!email || !fullname || !password){
           return  res.status(404).json({success:false,message:"please provide complete details"})
        }

        const olduser = await UserModel.findOne({email})
        if(olduser){
          return  res.status(404).json({success:false,message:"email already exists"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedpass = await bcrypt.hash(password,salt)

        const newUser = new UserModel({
            email,
            fullname,
            password:hashedpass
        })

        const User = await newUser.save()

         createToken(User._id,res)

          return  res.status(200).json({success:true,message:"New User Created Successfully",User})
             

        
    } catch (error) {
       return  res.status(404).json({success:false,message:"Error while creating user",error})
    }
} 


export const login = async (req, res) => {
    const { email, password } = req.body;

    try {

        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development"
        });

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please provide all credentials" });
        }

        const oldUser = await UserModel.findOne({ email });

        if (!oldUser) {
            return res.status(401).json({ success: false, message: "Invalid email credentials" });
        }

        const isCorrectPassword = await bcrypt.compare(password, oldUser.password);
        if (!isCorrectPassword) {
            return res.status(401).json({ success: false, message: "Invalid password credentials" });
        }

        createToken(oldUser._id, res);

        return res.status(200).json({ success: true, message: "User Logged-in Successfully",User:{
            _id: oldUser._id,
            fullName: oldUser.fullname,
            email: oldUser.email,
            profilePic: oldUser.profilepic}
          });

    } catch (error) {
        console.error("Login Error:", error);
        res.clearCookie("jwt");
        return res.status(500).json({ success: false, message: "Error while logging-in user", error });
    }
};


export const logout = async (req,res) =>{

    try {
        res.clearCookie('jwt',{
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development"
        })
        return res.status(202).json({success:true, message:"user loggedout successfully"})
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error while logging-out user", error });
    }
    
} 

export const updateUser = async (req, res) => {

    try {

        if (!req.files || !req.files.profilepic) {
        return res.status(400).json({ success: false, message: "Please provide a profile picture" });
      }
  
      const file = req.files.profilepic; 
      const userID = req.user._id;
  
    
      const result = await uploadCloudImage(file.tempFilePath);
  
      const updatedUser = await UserModel.findByIdAndUpdate(
        userID,
        { profilepic: result },
        { new: true }
      );
  
      return res.status(200).json({ success: true, user: updatedUser });

    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: "Error while updating user", error });
    }
  };


export const checkAuth = async (req,res)=>{

    try {
        return res.status(201).json(req.user)
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error at checkauth ", error });
    }
}