import { useQuery } from "@tanstack/react-query";
import ApiService from "../services/apiService";
import { AxiosError } from "axios";
import { IUserSnapshot } from "./useFriends";

const useNewFriends = () => {
  const apiService = new ApiService<IUserSnapshot[]>("/users/find");
  const authToken = localStorage.getItem("auth-token");

  const getFriends = useQuery<IUserSnapshot[], AxiosError>({
    queryFn: apiService.get,
    queryKey: ["friends"],
    enabled: authToken !== null,
  });

  return {
    newFriends: getFriends.data,
    isGetNewFriendsPending: getFriends.isPending,
    isGetNewFriendsSuccess: getFriends.isSuccess,
    isGetNewFriendsError: getFriends.isError,
    GetNewFriendsErrors: getFriends.error?.response?.data,
  };
};

export default useNewFriends;
