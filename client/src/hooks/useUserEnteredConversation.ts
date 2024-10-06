import { useQueryClient } from "@tanstack/react-query";
import { IConversationSnapshot } from "./useConversations";

const useUserEnteredConversation = (conversationId: string) => {
  const queryClient = useQueryClient();

  queryClient.setQueryData(
    ["conversations"],
    (oldData: IConversationSnapshot[]) => {
      return oldData.map((conversation) => {
        if (conversation._id !== conversationId) return conversation;
        return {
          ...conversation,
          cntNewMessages: 0,
        };
      });
    }
  );
};

export default useUserEnteredConversation;
