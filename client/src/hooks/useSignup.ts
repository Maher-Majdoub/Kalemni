import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import ApiService from "../services/apiService";
import { toast } from "react-toastify";

export interface SingupInput {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface SingupData {}

const useSignup = () => {
  const apiService = new ApiService<SingupData, SingupInput>("/auth/signup");
  const signupMutation = useMutation<
    SingupData,
    AxiosError<{ message: string }>,
    SingupInput
  >({
    mutationFn: (input) => apiService.post(input),
    onSuccess: () => {
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
