import { QueryClient, useMutation } from "@tanstack/react-query";
import ApiService from "../services/apiService";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { IProfileData } from "./useProfile";

const useDeleteProfilePicture = (queryClient: QueryClient) => {
  const apiService = new ApiService("/users/me/profile/picture");
  const mutation = useMutation<{}, AxiosError, {}>({
    mutationFn: apiService.delete,
    onSuccess: () => {
      queryClient.setQueryData(["me"], (oldData: IProfileData) => {
        return { ...oldData, profilePicture: undefined };
      });
      toast.success("Profile picture deleted successfully");
    },
    onError: () => {
      toast.error("Something went wrong while deleting profile picture");
    },
  });

  return {
    deleteProfilePicture: mutation.mutate,
    isDeleteProfilePicturePending: mutation.isPending,
    isDeleteProfilePictureSuccess: mutation.isSuccess,
    isDeleteProfilePictureError: mutation.isError,
    deleteProfilePictureError: mutation.error?.response?.data,
  };
};

export default useDeleteProfilePicture;
