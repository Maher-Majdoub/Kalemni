import { useMutation, useQueryClient } from "@tanstack/react-query";
import ApiService from "../services/apiService";
import { AxiosError } from "axios";
import { IMessage } from "./useConversation";
import useAddMessage from "./useAddMessage";
import useProfile from "./useProfile";

export interface MessageInput {
  message: { content: string };
}

interface MessageData {}

const getRandomInt = () => Math.floor(Math.random() * 100000000).toString();

const useSendMessage = (conversationId: string) => {
  const apiService = new ApiService<MessageData, MessageInput>(
    `/users/me/conversations/${conversationId}`
  );

  const queryClient = useQueryClient();
  const { profile } = useProfile();

  const mutation = useMutation<MessageData, AxiosError, MessageInput>({
    mutationFn: apiService.post,
    onMutate: (variables) => {
      const { addMessage } = useAddMessage(queryClient);
      const newMessage: IMessage = {
        _id: getRandomInt(),
        content: variables.message.content,
        sender: {
          _id: profile?._id as string,
          firstName: profile?.firstName as string,
          lastName: profile?.lastName as string,
        },
        sentByMe: true,
      };

      addMessage({ conversationId: conversationId, message: newMessage });
    },
  });

  return {
    sendMessage: mutation.mutate,
    isSendMessagePending: mutation.isPending,
    isSendMessageSuccess: mutation.isSuccess,
    isSendMessageError: mutation.isError,
    sendMessageError: mutation.error?.response?.data,
  };
};

export default useSendMessage;
