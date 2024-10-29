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

  useEffect(() => {
    if (isSignupSuccess || isSendGoolgeLoginSuccess) navigate("/");
  }, [isSignupSuccess, isSendGoolgeLoginSuccess]);

  return (
    <ColoredContainer>
      <AuthCard
        onSubmit={signup}
        isLoading={isSignupPending}
        isSignup
        onGoogleLogin={googleLogin}
      />
    </ColoredContainer>
  );
};

export default SignupPage;
