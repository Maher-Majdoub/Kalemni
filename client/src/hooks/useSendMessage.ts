import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IConversation, IMessage, MessageType } from "./useConversation";
import { AxiosError } from "axios";
import useAddMessage from "./useAddMessage";
import useProfile from "./useProfile";
import ApiService from "../services/apiService";

export interface IMessageInput {
  content: string;
  type: MessageType;
  audio?: Blob;
  video?: Blob;
  image?: Blob;
}

const getRandomInt = () => Math.floor(Math.random() * 100000000).toString();

const useSendMessage = (conversationId: string) => {
  const sendMessage = async ({
    content,
    audio,
    video,
    image,
    type,
  }: IMessageInput) => {
    const apiService = new ApiService<IMessage, FormData>(
      `/users/me/conversations/${conversationId}/messages/${type}`
    );

    console.log(type);

    const formData = new FormData();
    formData.append(
      "message",
      JSON.stringify({ content: content, type: type })
    );

    if (type === "audio" && audio) formData.append("audio", audio);
    if (type === "video" && video) formData.append("video", video);
    if (type === "image" && image) formData.append("image", image);

    return apiService.postFormData(formData);
  };

  const queryClient = useQueryClient();
  const { profile } = useProfile();

  const mutation = useMutation<IMessage, AxiosError, IMessageInput, string>({
    mutationFn: (data) => sendMessage(data),
    onMutate: (variables) => {
      const { addMessage } = useAddMessage(queryClient);
      const randomId = getRandomInt();
      const newMessage: IMessage = {
        _id: randomId,
        content: variables.content,
        type: variables.type,
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
              if (message._id === context) return { ...message, ...data };
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
