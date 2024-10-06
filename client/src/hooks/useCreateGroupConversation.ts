import { useMutation } from "@tanstack/react-query";
import { IConversation } from "./useConversation";
import { AxiosError } from "axios";
import ApiService from "../services/apiService";

interface CreateConversationInput {
  conversationName: string;
  participants: string[];
}

const useCreateConversation = () => {
  const apiService = new ApiService<IConversation, CreateConversationInput>(
    "/users/me/conversations/create"
  );

  const mutation = useMutation<
    IConversation,
    AxiosError,
    CreateConversationInput
  >({
    mutationFn: apiService.post,
  });

  return {
    createConversation: mutation.mutate,
    isCreateConversationPending: mutation.isPending,
    isCreateConversationSuccess: mutation.isSuccess,
    isCreateConversationError: mutation.isError,
    createConversationError: mutation.error,
  };
};

export default useCreateConversation;
