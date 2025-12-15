import mongoose from "mongoose";
const conDb= async ()=>{
    try {
        const conn= await mongoose.connect(process.env.MONGO_URI);
        console.log("mongodb connected sucessfully");
        

    } catch (error) {
        console.log("mongodb connection failed ",error);
        
    }
};
export default conDb;