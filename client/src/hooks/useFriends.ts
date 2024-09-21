import { useQuery } from "@tanstack/react-query";
import ApiService from "../services/apiService";
import { AxiosError } from "axios";

interface FriendData {
  _id: string;
  firstName: string;
  lastName: string;
}

const useFriends = () => {
  const apiService = new ApiService<FriendData[]>("/users/me/friends");

  const getFriends = useQuery<FriendData[], AxiosError>({
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
