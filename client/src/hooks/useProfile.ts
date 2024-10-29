import { useQuery } from "@tanstack/react-query";
import ApiService from "../services/apiService";
import { IUserSnapshot } from "./useFriends";
import { AxiosError } from "axios";

export interface IProfileInfos {
  firstName: string;
  lastName: string;
  bio?: string;
  gender?: "m" | "f";
  birthDate?: Date;
}

export interface IProfileData extends IProfileInfos {
  _id: string;
  authType: "normal" | "google";
  profilePicture?: string;
  friends: IUserSnapshot[];
}

const useProfile = () => {
  const apiService = new ApiService<IProfileData>("/users/me");
  const authToken = localStorage.getItem("auth-token");

  const getProfile = useQuery<IProfileData, AxiosError>({
    queryFn: apiService.get,
    queryKey: ["me"],
    enabled: authToken !== null,
    staleTime: Infinity,
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
