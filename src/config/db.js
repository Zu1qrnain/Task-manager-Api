const mongoose=require("mongoose");

require("dotenv").config();
const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to mongoDb")

    }
    catch (error){

        console.log("MongoDb connection failed",error);
        process.exit(1);
    }

};
module.exports=connectDB
