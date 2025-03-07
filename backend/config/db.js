import mongoose from "mongoose";

export  const connectDB = async ()=>{
    await mongoose.connect("mongodb+srv://sunexxlot:FOODDELIVERYAPP@cluster0.ilpqduc.mongodb.net/foodapp").then(()=>console.log("Database Connected"));

}