import { useQuery } from "@tanstack/react-query";
import ApiService from "../services/apiService";
import { AxiosError } from "axios";

export interface IUserSnapshot {
  _id: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
}

const useFriends = () => {
  const apiService = new ApiService<IUserSnapshot[]>("/users/me/friends");
  const authToken = localStorage.getItem("auth-token");

  const getFriends = useQuery<IUserSnapshot[], AxiosError>({
    queryFn: apiService.get,
    queryKey: ["friends"],
    enabled: authToken !== null,
  });

  return {
    friends: getFriends.data,
    isGetFriendsPending: getFriends.isPending,
    isGetFriendsSuccess: getFriends.isSuccess,
    isGetFriendsError: getFriends.isError,
    error: getFriends.error?.response?.data,
  };
};

export default useFriends;
