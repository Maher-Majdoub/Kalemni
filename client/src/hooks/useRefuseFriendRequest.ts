import { useMutation } from "@tanstack/react-query";
import ApiService from "../services/apiService";
import { AxiosError } from "axios";

const useRefuseFriendRequest = (requestId: string) => {
  const apiService = new ApiService<{}, {}>(
    `/users/me/friends/requests/${requestId}/refuse`
  );

  const mutation = useMutation<{}, AxiosError, {}>({
    mutationFn: () => apiService.post({}),
  });

  return {
    refuseFriendRequest: mutation.mutate,
    isRefuseFriendRequestPending: mutation.isPending,
    isRefuseFriendRequestSuccess: mutation.isSuccess,
    isRefuseFriendRequestError: mutation.isError,
    refuseFriendRequestErrors: mutation.error?.response?.data,
  };
};

export default useRefuseFriendRequest;
