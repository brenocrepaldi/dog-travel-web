import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChatApi, type ChatMsg } from "../api/chat.api";

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
  const queryKey = ["chat", walkId];

  return useMutation({
    mutationFn: ({ senderId, text }: { senderId: string; text: string }) =>
      ChatApi.sendMessage(walkId, senderId, text),

    onMutate: async ({ senderId, text }) => {
      // Cancel any in-flight refetch so it doesn't overwrite our optimistic entry
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<ChatMsg[]>(queryKey);

      const optimisticMsg: ChatMsg = {
        id: `optimistic-${Date.now()}`,
        senderId,
        text,
        sentAt: new Date().toISOString(),
        read: false,
      };

      queryClient.setQueryData<ChatMsg[]>(queryKey, (prev) => [
        ...(prev ?? []),
        optimisticMsg,
      ]);

      return { previous };
    },

    onError: (_err, _vars, context) => {
      // Roll back to the pre-mutation snapshot on failure
      if (context?.previous !== undefined) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },

    onSettled: () => {
      // Always sync with the server to replace the optimistic entry with the real one
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
