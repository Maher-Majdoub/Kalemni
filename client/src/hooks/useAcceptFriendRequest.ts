import { useMutation } from "@tanstack/react-query";
import ApiService from "../services/apiService";
import { AxiosError } from "axios";

const useAcceptFriendRequest = (requestId: string) => {
  const apiService = new ApiService<{}, {}>(
    `/users/me/friends/requests/${requestId}/accept`
  );

  const mutation = useMutation<{}, AxiosError, {}>({
    mutationFn: () => apiService.post({}),
  });

  return {
    acceptFriendRequest: mutation.mutate,
    isAcceptFriendRequestPending: mutation.isPending,
    isAcceptFriendRequestSuccess: mutation.isSuccess,
    isAcceptFriendRequestError: mutation.isError,
    acceptFriendRequestErrors: mutation.error?.response?.data,
  };
};

export default useAcceptFriendRequest;
