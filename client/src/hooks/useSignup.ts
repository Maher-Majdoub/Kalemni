import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import ApiService from "../services/apiService";
import { toast } from "react-toastify";
import { useAuthContext } from "../providers/AuthProvider";

export interface SingupInput {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface SingupData {
  token: string;
}

const useSignup = () => {
  const apiService = new ApiService<SingupData, SingupInput>("/auth/signup");
  const [_, setAuthToken] = useAuthContext();

  const signupMutation = useMutation<
    SingupData,
    AxiosError<{ message: string }>,
    SingupInput
  >({
    mutationFn: (input) => apiService.post(input),
    onSuccess: (data) => {
      localStorage.setItem("auth-token", data.token);
      setAuthToken(data.token);
      toast.success("You have successfully signed up");
    },
    onError: (err) => {
      toast.error(err.response?.data.message);
    },
  });

  return {
    signup: signupMutation.mutate,
    isSignupPending: signupMutation.isPending,
    isSignupSuccess: signupMutation.isSuccess,
    isSignupError: signupMutation.isError,
    error: signupMutation.error?.response?.data,
  };
};

export default useSignup;
