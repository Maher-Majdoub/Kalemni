import { QueryClient } from "@tanstack/react-query";
import { IConversation, IMessage } from "./useConversation";
import { IConversationSnapshot } from "./useConversations";

export interface IAddMessage {
  conversationId: string;
  message: IMessage;
  sentByMe: boolean;
}

const useAddMessage = (queryClient: QueryClient) => {
  const addMessage = ({ conversationId, message, sentByMe }: IAddMessage) => {
    queryClient.setQueryData(
      ["conversation", conversationId],
      (oldData: IConversation) => {
        if (!oldData) return;
        return {
          ...oldData,
          messages: [message, ...oldData.messages],
        };
      }
    );

    queryClient.setQueryData(
      ["conversations"],
      (oldData: IConversationSnapshot[]) => {
        let conversation: IConversationSnapshot | undefined;
        for (const oldConversation of oldData) {
          if (oldConversation._id === conversationId) {
            conversation = {
              ...oldConversation,
              lastMessage: message,
              isLastMessageSentByMe: sentByMe,
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
