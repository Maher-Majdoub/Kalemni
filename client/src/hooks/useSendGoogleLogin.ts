import { useMutation } from "@tanstack/react-query";
import ApiService from "../services/apiService";
import { AxiosError } from "axios";
import { useAuthContext } from "../providers/AuthProvider";
import { toast } from "react-toastify";

interface TInput {
  accessToken: string;
}

interface TData {
  token: string;
}

const useSendGoogleLogin = () => {
  const apiService = new ApiService<TData, TInput>("/auth/google-login");

  const [_, setAuthToken] = useAuthContext();

  const mutation = useMutation<TData, AxiosError<{ message: string }>, TInput>({
    mutationFn: apiService.post,
    onSuccess: (data) => {
      localStorage.setItem("auth-token", data.token);
      setAuthToken(data.token);
      localStorage.setItem("auth-token", data.token);
      toast.success("You have succeffuly logged in");
    },
    onError: (err) => {
      toast.error(err.response?.data.message);
    },
  });

  return {
    sendGoogleLogin: mutation.mutate,
    isSendGoolgeLoginSuccess: mutation.isSuccess,
  };
};

export default useSendGoogleLogin;
