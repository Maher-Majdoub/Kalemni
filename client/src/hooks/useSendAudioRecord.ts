import { useMutation, useQueryClient } from "@tanstack/react-query";
import ApiService from "../services/apiService";
import { AxiosError } from "axios";
import useAddMessage from "./useAddMessage";
import { IMessage, IConversation } from "./useConversation";
import useProfile from "./useProfile";

const getRandomInt = () => Math.floor(Math.random() * 100000000).toString();

const useSendAudioRecord = (conversationId: string) => {
  const apiService = new ApiService<IMessage, FormData>(
    `/users/me/conversations/${conversationId}/audio`
  );

  const queryClient = useQueryClient();
  const { profile } = useProfile();

  const mutation = useMutation<IMessage, AxiosError, FormData, string>({
    mutationFn: apiService.postFormData,
    onMutate: () => {
      const { addMessage } = useAddMessage(queryClient);
      const randomId = getRandomInt();
      const newMessage: IMessage = {
        _id: randomId,
        content: "",
        type: "audio",
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
              if (message._id === context)
                return { ...message, _id: data._id, content: data.content };
              return message;
            }),
          };
        }
      );
    },
  });

  return {
    sendAudioRecord: mutation.mutate,
    isSendAudioRecordPending: mutation.isPending,
    isSendAudioRecordSuccess: mutation.isSuccess,
    isSendAudioRecordError: mutation.isError,
    sendAudioRecordError: mutation.error?.response?.data,
  };
};

export default useSendAudioRecord;
