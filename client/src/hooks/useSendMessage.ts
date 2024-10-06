import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IConversation, IMessage } from "./useConversation";
import { AxiosError } from "axios";
import useAddMessage from "./useAddMessage";
import useProfile from "./useProfile";
import ApiService from "../services/apiService";

export interface MessageInput {
  message: { content: string };
}

const getRandomInt = () => Math.floor(Math.random() * 100000000).toString();

const useSendMessage = (conversationId: string) => {
  const apiService = new ApiService<IMessage, MessageInput>(
    `/users/me/conversations/${conversationId}`
  );

  const queryClient = useQueryClient();
  const { profile } = useProfile();

  const mutation = useMutation<IMessage, AxiosError, MessageInput, string>({
    mutationFn: apiService.post,
    onMutate: (variables) => {
      const { addMessage } = useAddMessage(queryClient);
      const randomId = getRandomInt();
      const newMessage: IMessage = {
        _id: randomId,
        content: variables.message.content,
        sender: {
          _id: profile?._id as string,
          firstName: profile?.firstName as string,
          lastName: profile?.lastName as string,
        },
        createdAt: new Date(Date.now()),
        sentByMe: true,
      };

      addMessage({
        conversationId: conversationId,
        message: newMessage,
        sentByMe: true,
      });
      return randomId;
    },
    onSuccess: (data, _, context) => {
      // context: the random generated id of the message
      queryClient.setQueryData(
        ["conversation", conversationId],
        (oldData: IConversation) => {
          if (!oldData) return;
          return {
            ...oldData,
            messages: oldData.messages.map((message) => {
              if (message._id === context) return { ...message, _id: data._id };
              return message;
            }),
          };
        }
      );
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
