import { useQueryClient } from "@tanstack/react-query";
import { useSocketContext } from "../providers/SocketProvider";
import { toast } from "react-toastify";

const useLogout = () => {
  const queryClient = useQueryClient();
  const socket = useSocketContext();
  const logout = () => {
    socket?.disconnect();
    localStorage.removeItem("auth-token");
    queryClient.clear();
    toast.success("You have successfully logget out");
  };

  return { logout };
};

export default useLogout;
