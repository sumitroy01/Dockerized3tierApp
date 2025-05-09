import { create } from "zustand";

import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  expiryTime: 300000, // Default 5 minutes

  setExpiryTime: (time) => set({ expiryTime: time }),

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages, expiryTime, removeMessage } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        {
          ...messageData,
          expiryTime: expiryTime !== "off" ? expiryTime : null,
        }
      );
      const newMessage = res.data;
      set({ messages: [...messages, newMessage] });

      if (expiryTime !== "off") {
        setTimeout(() => {
          removeMessage(newMessage._id);
        }, expiryTime);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  // sendMessage: async (messageData) => {
  //   const { selectedUser, messages, expiryTime, removeMessage } = get();

  //   try {
  //     const res = await axiosInstance.post(
  //       `/messages/send/${selectedUser._id}`,
  //       {
  //         ...messageData,
  //         expiryTime: expiryTime !== "off" ? expiryTime : null,
  //       }
  //     );

  //     const newMessage = res.data;
  //     set({ messages: [...messages, newMessage] });

  //     if (expiryTime !== "off") {
  //       setTimeout(() => {
  //         removeMessage(newMessage._id);
  //       }, expiryTime);
  //     }
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || "Failed to send message");
  //   }
  // },

  // Updated deleteChat function (removes chat only locally)
  deleteChat: () => {
    set({ messages: [] }); // Clears the messages from the state
    toast.success("Chat deleted successfully");
  },

  subscribeToMessages: () => {
    const { selectedUser, removeMessage } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) return;

      // Add the new message to the state
      set((state) => ({
        messages: [...state.messages, newMessage],
      }));

      // Schedule deletion if expiry time is set
      if (newMessage.expiryTime) {
        setTimeout(() => {
          removeMessage(newMessage._id);
        }, newMessage.expiryTime);
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),

  removeMessage: (messageId) =>
    set((state) => ({
      messages: state.messages.filter((msg) => msg._id !== messageId),
    })),
}));

// import { create } from "zustand";

// import toast from "react-hot-toast";
// import { axiosInstance } from "../lib/axios";
// import { useAuthStore } from "./useAuthStore";

// export const useChatStore = create((set, get) => ({
//   messages: [],
//   users: [],
//   selectedUser: null,
//   isUsersLoading: false,
//   isMessagesLoading: false,
//   expiryTime: 300000, // Default 5 minutes

//   setExpiryTime: (time) => set({ expiryTime: time }),

//   getUsers: async () => {
//     set({ isUsersLoading: true });
//     try {
//       const res = await axiosInstance.get("/messages/users");
//       set({ users: res.data });
//     } catch (error) {
//       toast.error(error.response.data.message);
//     } finally {
//       set({ isUsersLoading: false });
//     }
//   },

//   getMessages: async (userId) => {
//     set({ isMessagesLoading: true });
//     try {
//       const res = await axiosInstance.get(`/messages/${userId}`);
//       set({ messages: res.data });
//     } catch (error) {
//       toast.error(error.response.data.message);
//     } finally {
//       set({ isMessagesLoading: false });
//     }
//   },

//   sendMessage: async (messageData) => {
//     const { selectedUser, messages, expiryTime, removeMessage } = get();

//     try {
//       const res = await axiosInstance.post(
//         `/messages/send/${selectedUser._id}`,
//         {
//           ...messageData,
//           expiryTime: expiryTime !== "off" ? expiryTime : null, // Store expiry time in backend
//         }
//       );

//       const newMessage = res.data;
//       set({ messages: [...messages, newMessage] });

//       // Set timeout to delete the message if expiry time is set
//       if (expiryTime !== "off") {
//         setTimeout(() => {
//           removeMessage(newMessage._id);
//         }, expiryTime);
//       }
//     } catch (error) {
//       toast.error(error.response.data.message);
//     }
//   },

//   subscribeToMessages: () => {
//     const { selectedUser, removeMessage } = get();
//     if (!selectedUser) return;

//     const socket = useAuthStore.getState().socket;

//     socket.on("newMessage", (newMessage) => {
//       if (newMessage.senderId !== selectedUser._id) return;

//       set({
//         messages: [...get().messages, newMessage],
//       });

//       // Schedule deletion if expiry time is set
//       if (newMessage.expiryTime) {
//         setTimeout(() => {
//           removeMessage(newMessage._id);
//         }, newMessage.expiryTime);
//       }
//     });
//   },

//   unsubscribeFromMessages: () => {
//     const socket = useAuthStore.getState().socket;
//     socket.off("newMessage");
//   },

//   setSelectedUser: (selectedUser) => set({ selectedUser }),

//   removeMessage: (messageId) =>
//     set((state) => ({
//       messages: state.messages.filter((msg) => msg._id !== messageId),
//     })),
// }));
