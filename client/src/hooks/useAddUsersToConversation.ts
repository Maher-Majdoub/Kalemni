import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ApiService from "../services/apiService";

const useAddUsersToConversation = (conversationId: string) => {
  const apiService = new ApiService(
    `/users/me/conversations/${conversationId}/users/add`
  );

  const mutation = useMutation({
    mutationFn: apiService.post,
    onSuccess: () => {
      toast.success("Users added successfully");
    },
    onError: () => {
      toast.error("Something went wrong while adding users");
    },
  });

  return {
    addUsersToConversation: mutation.mutate,
    isAddUsersToConversationPending: mutation.isPending,
    isAddUsersToConversationSuccess: mutation.isSuccess,
    isAddUsersToConversationError: mutation.isError,
    addUsersToConversationError: mutation.error,
  };
};

export default useAddUsersToConversation;
