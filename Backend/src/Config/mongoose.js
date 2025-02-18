import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()


const mongoConnect = async() => {
    await mongoose.connect(process.env.mongoDB)
    .then(()=>{
        console.log('Database is connected ')
    })
    .catch(()=>{
        console.log('Database unable to connect ')
    })
}

export default mongoConnect