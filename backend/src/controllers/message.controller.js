import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { decryptMessage } from "../utils/encrypt.js"; // Import decryption utility
import { encryptMessage } from "../utils/encrypt.js"; // Import encryption utility

// Fetch users for the sidebar (excluding the logged-in user)
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // Fetch all users except the logged-in user and exclude passwords
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch messages between two users
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params; // ID of the user to chat with
    const myId = req.user._id; // ID of the logged-in user

    // Fetch messages between the logged-in user and the other user
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId }, // Messages sent by me
        { senderId: userToChatId, receiverId: myId }, // Messages sent to me
      ],
    });

    // Decrypt the message text for each message
    const decryptedMessages = messages.map((message) => ({
      ...message.toObject(),
      text: decryptMessage(message.text), // Decrypt the encrypted text
    }));

    res.status(200).json(decryptedMessages); // Send decrypted messages to the frontend
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    // Encrypt the message text
    const encryptedText = encryptMessage(text);

    // Create a new message object
    const newMessage = new Message({
      senderId,
      receiverId,
      text: encryptedText, // Store encrypted text in the database
      image: imageUrl,
    });

    // Save the message to the database
    await newMessage.save();

    // Decrypt the message text for real-time display
    const decryptedText = decryptMessage(encryptedText);

    // Prepare the message to emit via WebSocket
    const messageToEmit = {
      ...newMessage.toObject(),
      text: decryptedText, // Emit decrypted text
    };

    // Notify the recipient via WebSocket if they are online
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", messageToEmit);
    }

    res.status(201).json(messageToEmit); // Respond with the decrypted message
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
