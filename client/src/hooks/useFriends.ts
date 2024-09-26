import { useQuery } from "@tanstack/react-query";
import ApiService from "../services/apiService";
import { AxiosError } from "axios";

export interface UserSnapshotData {
  _id: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
}

const useFriends = () => {
  const apiService = new ApiService<UserSnapshotData[]>("/users/me/friends");

  const getFriends = useQuery<UserSnapshotData[], AxiosError>({
    queryFn: apiService.get,
    queryKey: ["friends"],
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
