import { useEffect } from "react";
import useLogin from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";
import ColoredContainer from "../components/ColoredContainer";
import AuthCard from "../components/AuthCard";
import { useAuthContext } from "../providers/AuthProvider";

const LoginPage = () => {
  const { login, isLoginSuccess, isLoginPending } = useLogin();
  const [_, setAuthToken] = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoginSuccess) {
      setAuthToken(localStorage.getItem("auth-token"));
      navigate("/");
    }
  }, [isLoginSuccess]);

  return (
    <ColoredContainer>
      <AuthCard onSubmit={login} isLoading={isLoginPending} />
    </ColoredContainer>
  );
};

export default LoginPage;
