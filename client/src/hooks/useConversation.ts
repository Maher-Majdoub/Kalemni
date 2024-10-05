import { useQuery } from "@tanstack/react-query";
import { IUserSnapshot } from "./useFriends";
import ApiService from "../services/apiService";
import { AxiosError } from "axios";

export interface IMessage {
  _id: string;
  sender: IUserSnapshot;
  content: string;
  sentByMe: boolean;
  createdAt?: Date;
  seenUsers?: IUserSnapshot[];
}

export interface IConversation {
  _id: string;
  type: "private" | "group";
  participants: {
    user: IUserSnapshot;
    lastSeenMessageId: string;
    isTyping?: boolean;
  }[];
  messages: IMessage[];
}

const useConversation = (conversationId: string) => {
  const apiService = new ApiService<IConversation>(
    `/users/me/conversations/${conversationId}`
  );
  const authToken = localStorage.getItem("auth-token");

  const query = useQuery<IConversation, AxiosError>({
    queryFn: apiService.get,
    queryKey: ["conversation", conversationId],
    enabled: authToken !== null,
    staleTime: Infinity,
  });

  return {
    conversation: query.data,
    isGetConversationPending: query.isPending,
    isGetConversationSuccess: query.isSuccess,
    isGetConversationError: query.isError,
    getConversationError: query.error?.response?.data,
  };
};

export default useConversation;
