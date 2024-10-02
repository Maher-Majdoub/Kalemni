import { useQuery } from "@tanstack/react-query";
import ApiService from "../services/apiService";
import { IUserSnapshot } from "./useFriends";
import { AxiosError } from "axios";

interface ProfileData {
  _id: string;
  firstName: string;
  lastName: string;
  gender?: "m" | "f";
  birthDate: Date;
  profilePicture: string;
  friends: IUserSnapshot[];
}

const useProfile = () => {
  const apiService = new ApiService<ProfileData>("/users/me");
  const authToken = localStorage.getItem("auth-token");

  const getProfile = useQuery<ProfileData, AxiosError>({
    queryFn: apiService.get,
    queryKey: ["me"],
    enabled: authToken !== null,
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
