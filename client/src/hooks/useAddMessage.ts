import { QueryClient } from "@tanstack/react-query";
import { IConversation, IMessage } from "./useConversation";
import { IConversationSnapshot } from "./useConversations";

export interface IAddMessage {
  conversationId: string;
  message: IMessage;
}

const useAddMessage = (queryClient: QueryClient) => {
  const addMessage = (data: IAddMessage) => {
    queryClient.setQueryData(
      ["conversation", data.conversationId],
      (oldData: IConversation) => {
        if (!oldData) return;
        return {
          ...oldData,
          messages: [data.message, ...oldData.messages],
        };
      }
    );

    queryClient.setQueryData(
      ["conversations"],
      (oldData: IConversationSnapshot[]) => {
        let conversation: IConversationSnapshot | undefined;
        for (const oldConversation of oldData) {
          if (oldConversation._id === data.conversationId) {
            conversation = {
              ...oldConversation,
              lastMessage: data.message,
            };
          }
        }

        if (!conversation) return oldData;

        return [
          conversation,
          ...oldData.filter((data) => data._id !== conversation?._id),
        ];
      }
    );
  };
  return { addMessage };
};

export default useAddMessage;
