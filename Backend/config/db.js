import mongoose from "mongoose";

const connectDb = async()=>{
        try{
                await mongoose.connect(process.env.MONGO_URL)
                console.log("Database connected successfully");
        }catch(error){
                console.log("database connection failed",error);
        }
}

export default connectDb;
