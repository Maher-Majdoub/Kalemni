import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { IUserSnapshot } from "./useFriends";
import ApiService from "../services/apiService";

export type MessageType = "text" | "audio" | "image" | "video";

export interface IMessage {
  _id: string;
  sender: IUserSnapshot;
  type: MessageType;
  content: string;
  sentByMe: boolean;
  createdAt?: Date;
}

export interface IConversation {
  _id: string;
  type: "p" | "g";
  participants: {
    user: IUserSnapshot;
    lastSawMessageId?: string;
    isTyping?: boolean;
  }[];
  messages: IMessage[];
  name?: string;
  picture?: string;
}

const useConversation = (conversationId: string) => {
  const apiService = new ApiService<IConversation>(
    `/users/me/conversations/${conversationId}`
  );
  const authToken = localStorage.getItem("auth-token");

  const query = useQuery<IConversation, AxiosError<{ message: string }>>({
    queryFn: apiService.get,
    queryKey: ["conversation", conversationId],
    enabled: authToken !== null,
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
