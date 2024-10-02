import { useQueryClient } from "@tanstack/react-query";

const useLogout = () => {
  const queryClient = useQueryClient();
  const logout = () => {
    localStorage.removeItem("auth-token");
    queryClient.clear();
  };

  return { logout };
};

export default useLogout;
