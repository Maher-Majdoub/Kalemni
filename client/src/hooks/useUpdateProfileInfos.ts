import { QueryClient, useMutation } from "@tanstack/react-query";
import { IProfileData, IProfileInfos } from "./useProfile";
import { AxiosError } from "axios";
import ApiService from "../services/apiService";
import { toast } from "react-toastify";

interface IData {
  data: IProfileInfos;
}

const useUpdateProfileInfos = (queryClient: QueryClient) => {
  const apiService = new ApiService<IData, IData>("/users/me/profile/infos");

  const mutation = useMutation<IData, AxiosError, IData>({
    mutationFn: apiService.patch,
    onSuccess: (data) => {
      queryClient.setQueryData(["me"], (oldData: IProfileData) => {
        return { ...oldData, ...data };
      });
      toast.success("Profile infos updated successfully");
    },
    onError: () => {
      toast.error("Something went wrong while updating profile infos");
    },
  });

  return {
    updateProfileInfos: mutation.mutate,
    isUpdateProfileInfosPending: mutation.isPending,
    isUpdateProfileInfosSuccess: mutation.isSuccess,
    isUpdateProfileInfosError: mutation.isError,
    updateProfileInfosError: mutation.error,
  };
};

export default useUpdateProfileInfos;
