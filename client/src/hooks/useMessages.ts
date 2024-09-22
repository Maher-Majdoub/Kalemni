import { useQuery } from "@tanstack/react-query";
import ApiService from "../services/apiService";
import { AxiosError } from "axios";

interface MessageData {
  _id: string;
  content: string;
  senderId: string;
  recipientId: string;
  createdAt: Date;
  updatedAt: Date;
}

const useMessages = (friendId: string) => {
  const apiService = new ApiService<MessageData[]>(
    `/users/me/friends/${friendId}/messages`
  );
  const getMessages = useQuery<MessageData[], AxiosError>({
    queryFn: apiService.get,
    queryKey: ["messages", friendId],
  });

  return {
    messages: getMessages.data,
    isGetMessagesPending: getMessages.isPending,
    isGetMessagesSuccess: getMessages.isSuccess,
    isGetMessagesError: getMessages.isError,
    error: getMessages.error?.response?.data,
  };
};

export default useMessages;
