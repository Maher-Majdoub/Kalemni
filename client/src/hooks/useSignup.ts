import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import ApiService from "../services/apiService";

interface SingupInput {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface SingupData {}

const useSignup = () => {
  const apiService = new ApiService<SingupData, SingupInput>("/users/create");

  const signupMutation = useMutation<SingupData, AxiosError, SingupInput>({
    mutationFn: (input) => apiService.post(input),
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
