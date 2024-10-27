import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IConversation } from "./useConversation";
import { AxiosError } from "axios";
import ApiService from "../services/apiService";
import { toast } from "react-toastify";

interface CreateConversationInput {
  conversationName: string;
  participants: string[];
}

const useCreateConversation = () => {
  const apiService = new ApiService<IConversation, CreateConversationInput>(
    "/users/me/conversations/create"
  );

  const queryClient = useQueryClient();

  const mutation = useMutation<
    IConversation,
    AxiosError<{ message: string }>,
    CreateConversationInput
  >({
    mutationFn: apiService.post,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["conversations"] });
      toast.success("Group created successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data.message);
    },
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
