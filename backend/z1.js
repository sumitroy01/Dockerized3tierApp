import User from "./models/user.model.js";
import bcrypt from "bcryptjs"
import { generateToken } from "./lib/utils.js";
import cloudinary from "./lib/cloudinary.js";
import { getReceiverSocketId, io } from "./lib/socket.js";
import { decryptMessage, encryptMessage } from "./utils/encrypt.js"; // Import decryption and encryption utilities

export const getUsersForSidebar=async(req,res)=>{
    try{
        const loggedInUserId=req.User._id;

        const filteredUsers=await User.find({
            _:{$ne:loggedInUserId},
        }).select("-password");
        res.status(200).json(filteredUsers);

    }catch(error){


    }

}