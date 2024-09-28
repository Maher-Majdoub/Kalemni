import { useQuery } from "@tanstack/react-query";
import ApiService from "../services/apiService";
import { UserSnapshotData } from "./useFriends";
import { AxiosError } from "axios";

const useOnlineFriends = () => {
  const apiSevice = new ApiService<UserSnapshotData[]>(
    "/users/me/friends/online"
  );

  const query = useQuery<UserSnapshotData[], AxiosError>({
    queryFn: apiSevice.get,
    queryKey: ["onlineFriends"],
  });

  return {
    onlineFriends: query.data,
    isGetOnlineFriendsPending: query.isPending,
    isGetOnlineFriendsSuccess: query.isSuccess,
    isGetOnlineFriendsError: query.isError,
    getOnlineFriendsError: query.error?.response?.data,
  };
};

export default useOnlineFriends;
