import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import useLogin from "../hooks/useLogin";
import AuthCard from "../components/AuthCard";
import ColoredContainer from "../components/ColoredContainer";
import useSendGoogleLogin from "../hooks/useSendGoogleLogin";

const LoginPage = () => {
  const { login, isLoginSuccess, isLoginPending } = useLogin();
  const { sendGoogleLogin, isSendGoolgeLoginSuccess } = useSendGoogleLogin();

  const navigate = useNavigate();
  const googleLogin = useGoogleLogin({
    onSuccess: async (data) => {
      sendGoogleLogin({ accessToken: data.access_token });
    },
  });

  useEffect(() => {
    if (isLoginSuccess || isSendGoolgeLoginSuccess) navigate("/");
  }, [isLoginSuccess, isSendGoolgeLoginSuccess]);

  return (
    <ColoredContainer>
      <AuthCard
        onSubmit={login}
        isLoading={isLoginPending}
        onGoogleLogin={googleLogin}
      />
    </ColoredContainer>
  );
};

export default LoginPage;
