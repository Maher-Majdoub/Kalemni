import { useQuery } from "@tanstack/react-query";
import ApiService from "../services/apiService";
import { AxiosError } from "axios";
import { UserSnapshotData } from "./useFriends";

const useNewFriends = () => {
  const apiService = new ApiService<UserSnapshotData[]>("/users/find");

  const getFriends = useQuery<UserSnapshotData[], AxiosError>({
    queryFn: apiService.get,
    queryKey: ["friends"],
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
