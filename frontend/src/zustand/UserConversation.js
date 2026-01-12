import { create } from "zustand";

const userConversation = create((set) => ({
  selectedConversation: null,
  messages: [],

  setSelectedConversation: (selectedConversation) =>
    set({
      selectedConversation,
      messages: [], // clear old messages when switching chat
    }),

  setMessages: (messages) => set({ messages }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
}));

export default userConversation;
