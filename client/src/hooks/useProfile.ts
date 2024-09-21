import { useQuery } from "@tanstack/react-query";
import ApiService from "../services/apiService";
import { AxiosError } from "axios";

interface ProfileData {
  username: string;
  firstName: string;
  lastName: string;
}

const useProfile = () => {
  const apiService = new ApiService<ProfileData>("/users/me");

  const getProfile = useQuery<ProfileData, AxiosError>({
    queryFn: apiService.get,
    queryKey: ["me"],
  });

  return {
    profile: getProfile.data,
    isGetProfilePending: getProfile.isPending,
    isGetProfileSuccess: getProfile.isSuccess,
    isGetProfileError: getProfile.isError,
    error: getProfile.error?.response?.data,
  };
};

export default useProfile;
