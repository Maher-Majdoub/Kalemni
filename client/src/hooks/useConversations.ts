import { useQuery } from "@tanstack/react-query";
import ApiService from "../services/apiService";
import { AxiosError } from "axios";
import { IUserSnapshot } from "./useFriends";
import { MessageType } from "./useConversation";

export interface IConversationSnapshot {
  _id: string;
  type: "p" | "g";
  participants: {
    user: IUserSnapshot;
    lastSeenMessaageId?: string;
    isTyping?: boolean;
  }[];
  cntNewMessages: number;
  lastMessage: {
    _id: string;
    sender: IUserSnapshot | string;
    type: MessageType;
    content: string;
    createdAt?: Date;
  };
  isLastMessageSentByMe: boolean;
  name?: string;
  picture?: string;
}

const useConversations = () => {
  const apiService = new ApiService<IConversationSnapshot[]>(
    "/users/me/conversations"
  );
  const authToken = localStorage.getItem("auth-token");

  const getConversations = useQuery<IConversationSnapshot[], AxiosError>({
    queryFn: apiService.get,
    queryKey: ["conversations"],
    enabled: authToken !== null,
  });

  return {
    conversations: getConversations.data,
    isConversationsPending: getConversations.isPending,
    isGetConversationsSuccess: getConversations.isSuccess,
    isGetConversationsError: getConversations.isError,
    getConversationsErrors: getConversations.error?.response?.data,
  };
};

export default useConversations;
