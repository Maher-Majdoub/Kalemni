import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import ApiService from "../services/apiService";

export interface IUpdateLoginInfoInput {
  data: { newUsername?: string; newPassword?: string; oldPassword: string };
}

const useUpdateLoginInfos = () => {
  const apiServive = new ApiService<{}, IUpdateLoginInfoInput>(
    "/users/me/auth"
  );

  const mutation = useMutation<
    {},
    AxiosError<{ message: string }>,
    IUpdateLoginInfoInput
  >({
    mutationFn: apiServive.patch,
    onSuccess: () => {
      toast.success("Login infos updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message);
    },
  });

  return {
    updateLoginInfos: mutation.mutate,
    isUpdateLoginInfosPending: mutation.isPending,
    isUpdateLoginInfosSuccess: mutation.isSuccess,
    isUpdateLoginInfosError: mutation.isError,
    updateLoginInfosError: mutation.error,
  };
};

export default useUpdateLoginInfos;
