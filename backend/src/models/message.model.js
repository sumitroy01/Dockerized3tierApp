// import mongoose from "mongoose";

// const messageSchema = new mongoose.Schema(
//   {
//     senderId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     receiverId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     text: {
//       type: String,
//     },
//     image: {
//       type: String,
//     },
//     disappearAfter: {
//       type: Number, // Time in seconds before message deletion
//       required: true,
//       default: 30,
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   { timestamps: true }
// );

// const Message = mongoose.model("Message", messageSchema);

// // Function to delete expired messages
// const deleteExpiredMessages = async () => {
//   const now = new Date();
//   await Message.deleteMany({
//     createdAt: { $lte: new Date(now - 5000) }, // Deletes messages older than disappearAfter
//   });
// };

// // Run cleanup every 10 seconds
// setInterval(deleteExpiredMessages, 10);

// export default Message;

// #########################################################################################
// #########################################################################################
//     //

//     above is logic to delete messeages from backend
//     //
//     #########################################################################################
// #########################################################################################

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
