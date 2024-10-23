import { useMutation } from "@tanstack/react-query";
import ApiService from "../services/apiService";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

const useDeleteFriend = (userId: string) => {
  const apiService = new ApiService(`/users/me/friends/${userId}`);

  const mutation = useMutation<{}, AxiosError, {}>({
    mutationFn: apiService.delete,
    onSuccess: () => {
      toast.success("Friend deleted successfully");
    },
    onError: () => {
      toast.error("Something went wrong while deleting friend");
    },
  });

  return {
    deleteFriend: mutation.mutate,
    isDeleteFriendPending: mutation.isPending,
    isDeleteFriendSuccess: mutation.isSuccess,
    isDeleteFriendError: mutation.isError,
    deleteFriendError: mutation.error?.response?.data,
  };
};

export default useDeleteFriend;
