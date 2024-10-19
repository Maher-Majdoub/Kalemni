import { QueryClient, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import ApiService from "../services/apiService";
import { toast } from "react-toastify";
import { IProfileData } from "./useProfile";

interface TData {
  picture: string;
}

const useUpdateProfilePicture = (queryClient: QueryClient) => {
  const apiService = new ApiService<TData, FormData>(
    "/users/me/profile/picture"
  );

  const mutation = useMutation<TData, AxiosError, FormData>({
    mutationFn: apiService.patchFormData,
    onSuccess: ({ picture }) => {
      queryClient.setQueryData(["me"], (oldData: IProfileData) => {
        return { ...oldData, profilePicture: picture };
      });
      toast.success("Profile picture updated successfully");
    },
    onError: () => {
      toast.error("Something went wrong while updating profile picture");
    },
  });

  return {
    updateProfilePicture: mutation.mutate,
    isUpdateProfilePicutrePending: mutation.isPending,
    isUpdateProfilePicutreSuccess: mutation.isSuccess,
    isUpdateProfilePicutreError: mutation.isError,
    updateProfilePicutre: mutation.error?.response?.data,
  };
};

export default useUpdateProfilePicture;
