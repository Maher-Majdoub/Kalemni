import { useQuery } from "@tanstack/react-query";
import ApiService from "../services/apiService";
import { IUserSnapshot } from "./useFriends";
import { AxiosError } from "axios";

const useOnlineFriends = () => {
  const apiSevice = new ApiService<IUserSnapshot[]>("/users/me/friends/online");

  const authToken = localStorage.getItem("auth-token");

  const query = useQuery<IUserSnapshot[], AxiosError>({
    queryFn: apiSevice.get,
    queryKey: ["onlineFriends"],
    enabled: authToken !== null,
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
