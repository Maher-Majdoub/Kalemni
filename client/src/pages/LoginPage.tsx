import { useEffect } from "react";
import useLogin from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";
import ColoredContainer from "../components/ColoredContainer";
import AuthCard from "../components/AuthCard";

const LoginPage = () => {
  const { login, isLoginSuccess, isLoginPending, isLoginError } = useLogin();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoginSuccess) {
      navigate("/");
    }
  }, [isLoginSuccess]);

  if (isLoginError) {
    console.log("invalid login");
  }

  return (
    <ColoredContainer>
      <AuthCard onSubmit={login} isLoading={isLoginPending} />
    </ColoredContainer>
  );
};

export default LoginPage;
