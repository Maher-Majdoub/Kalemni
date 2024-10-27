import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import ApiService from "../services/apiService";
import { toast } from "react-toastify";
import { useAuthContext } from "../providers/AuthProvider";

interface LoginInput {
  username: string;
  password: string;
}

interface LoginData {
  token: string;
}

const useLogin = () => {
  const apiService = new ApiService<LoginData, LoginInput>("/auth/login");
  const [_, setAuthToken] = useAuthContext();

  const loginMutation = useMutation<
    LoginData,
    AxiosError<{ message: string }>,
    LoginInput
  >({
    mutationFn: (input) => apiService.post(input),
    onSuccess: (data) => {
      localStorage.setItem("auth-token", data.token);
      setAuthToken(data.token);
      toast.success("You have succeffuly logged in");
    },
    onError: (err) => {
      toast.error(err.response?.data.message);
    },
  });

  return {
    login: loginMutation.mutate,
    isLoginPending: loginMutation.isPending,
    isLoginSuccess: loginMutation.isSuccess,
    isLoginError: loginMutation.isError,
    error: loginMutation.error?.response?.data,
  };
};

export default useLogin;
