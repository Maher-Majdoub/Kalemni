import { useQueryClient } from "@tanstack/react-query";
import { useSocketContext } from "../providers/SocketProvider";

const useLogout = () => {
  const queryClient = useQueryClient();
  const socket = useSocketContext();
  const logout = () => {
    socket?.disconnect();
    localStorage.removeItem("auth-token");
    queryClient.clear();
  };

  return { logout };
};

export default useLogout;
