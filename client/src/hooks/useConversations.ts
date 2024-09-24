import { useQuery } from "@tanstack/react-query";
import ApiService from "../services/apiService";
import { AxiosError } from "axios";

interface ConversationData {}

const useConversations = () => {
  const apiService = new ApiService<ConversationData>("/api/conversations");

  const getConversations = useQuery<ConversationData, AxiosError>({
    queryFn: apiService.get,
    queryKey: ["conversations"],
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
