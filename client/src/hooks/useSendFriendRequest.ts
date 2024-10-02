import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { IUserSnapshot } from "./useFriends";
import ApiService from "../services/apiService";

const useSendFriendRequest = (userId: string) => {
  const apiService = new ApiService<IUserSnapshot>(
    `/users/${userId}/friend-requests`
  );
  const mutation = useMutation<IUserSnapshot, AxiosError, {}>({
    mutationFn: apiService.post,
  });

  return {
    sendFriendRequest: mutation.mutate,
    isSendFriendRequestPending: mutation.isPending,
    isSendFriendRequestSuccess: mutation.isSuccess,
    isSendFriendRequestError: mutation.isError,
    sendFriendRequestErrors: mutation.error,
  };
};

export default useSendFriendRequest;
