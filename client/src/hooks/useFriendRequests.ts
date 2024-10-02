import { useQuery } from "@tanstack/react-query";
import { IUserSnapshot } from "./useFriends";
import { AxiosError } from "axios";
import ApiService from "../services/apiService";

interface FriendRequestdData {
  _id: string;
  user: IUserSnapshot;
}

const useFriendRequests = () => {
  const apiService = new ApiService<FriendRequestdData[]>(
    "/users/me/friends/requests"
  );
  const authToken = localStorage.getItem("auth-token");

  const query = useQuery<FriendRequestdData[], AxiosError>({
    queryFn: apiService.get,
    queryKey: ["friend-requests"],
    enabled: authToken !== null,
  });

  return {
    friendRequests: query.data,
    isGetFriendRequestsPending: query.isPending,
    isGetFriendRequestsSuccess: query.isSuccess,
    isGetFriendRequestsError: query.isError,
    getFriendRequestsErrors: query.error?.response?.data,
  };
};

export default useFriendRequests;
