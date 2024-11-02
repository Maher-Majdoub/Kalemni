import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import AuthCard from "../components/AuthCard";
import useSignup from "../hooks/useSignup";
import ColoredContainer from "../components/ColoredContainer";
import useSendGoogleLogin from "../hooks/useSendGoogleLogin";

export const SignupPage = () => {
  const { signup, isSignupPending, isSignupSuccess } = useSignup();
  const { sendGoogleLogin, isSendGoolgeLoginSuccess } = useSendGoogleLogin();
  const googleLogin = useGoogleLogin({
    onSuccess: async (data) => {
      sendGoogleLogin({ accessToken: data.access_token });
    },
  });

  const navigate = useNavigate();

  const handleSignup = (data: any) => {
    const filteredData = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      username: data.userName.trim(),
      password: data.password.trim(),
    };

    signup(filteredData);
  };

  useEffect(() => {
    if (isSignupSuccess || isSendGoolgeLoginSuccess) navigate("/");
  }, [isSignupSuccess, isSendGoolgeLoginSuccess]);

  return (
    <ColoredContainer>
      <AuthCard
        onSubmit={handleSignup}
        isLoading={isSignupPending}
        isSignup
        onGoogleLogin={googleLogin}
      />
    </ColoredContainer>
  );
};

export default SignupPage;
