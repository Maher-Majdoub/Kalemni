import { useMutation } from "@tanstack/react-query";
import ApiService from "../services/apiService";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

const useLeaveConversation = (conversationId: string) => {
  const apiService = new ApiService(
    `/users/me/conversations/${conversationId}/leave`
  );

  const mutation = useMutation<{}, AxiosError<{ message: string }>>({
    mutationFn: apiService.delete,
    onSuccess: () => {
      toast.success("You have successfully left the conversation");
    },
    onError: (err) => {
      toast.error(err.response?.data.message);
    },
  });

  return {
    leaveConversation: mutation.mutate,
    isLeaveConversationPending: mutation.isPending,
    isLeaveConversationSuccess: mutation.isSuccess,
    isLeaveConversationError: mutation.isError,
    leaveConversationError: mutation.error?.response?.data,
  };
};

export default useLeaveConversation;
