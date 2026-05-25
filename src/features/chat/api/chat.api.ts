import { chatMessagesByWalk } from "@/lib/mock-data";
import api, { isApiConfigured } from "@/services/api";

export interface ChatMsg {
  id: string;
  senderId: string;
  text: string;
  sentAt: string;
  read: boolean;
}

// Module-level mutable store — used only when API is not configured
const chatStore: Record<string, ChatMsg[]> = Object.fromEntries(
  Object.entries(chatMessagesByWalk).map(([k, v]) => [k, [...v]])
);

export const ChatApi = {
  getMessages: async (walkId: string): Promise<ChatMsg[]> => {
    if (!isApiConfigured) {
      return [...(chatStore[walkId] ?? [])];
    }
    return api
      .get<ChatMsg[]>(`/walks/${walkId}/messages`)
      .then((r) => r.data);
  },

  sendMessage: async (walkId: string, senderId: string, text: string): Promise<ChatMsg> => {
    if (!isApiConfigured) {
      const msg: ChatMsg = {
        id: crypto.randomUUID(),
        senderId,
        text,
        sentAt: new Date().toISOString(),
        read: false,
      };
      chatStore[walkId] = [...(chatStore[walkId] ?? []), msg];
      return msg;
    }
    return api
      .post<ChatMsg>(`/walks/${walkId}/messages`, { senderId, text })
      .then((r) => r.data);
  },
};
