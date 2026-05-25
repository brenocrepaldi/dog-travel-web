import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChatApi } from "../api/chat.api";

export function useChat(walkId: string) {
  return useQuery({
    queryKey: ["chat", walkId],
    queryFn: () => ChatApi.getMessages(walkId),
    enabled: Boolean(walkId),
    refetchInterval: 5_000, // poll every 5s — replace with WebSocket subscription when available
    staleTime: 0,
  });
}

export function useSendMessage(walkId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ senderId, text }: { senderId: string; text: string }) =>
      ChatApi.sendMessage(walkId, senderId, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat", walkId] });
    },
  });
}
