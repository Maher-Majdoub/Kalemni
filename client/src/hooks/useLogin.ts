import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import ApiService from "../services/apiService";

interface LoginInput {
  username: string;
  password: string;
}

interface LoginData {
  token: string;
}

const useLogin = () => {
  const apiService = new ApiService<LoginData, LoginInput>("/auth/login");

  const loginMutation = useMutation<LoginData, AxiosError, LoginInput>({
    mutationFn: (input) => apiService.post(input),
    onSuccess: (data) => {
      localStorage.setItem("auth-token", data.token);
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
