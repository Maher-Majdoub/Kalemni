import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useSignup from "../hooks/useSignup";
import ColoredContainer from "../components/ColoredContainer";
import AuthCard from "../components/AuthCard";

export const SignupPage = () => {
  const { signup, isSignupPending, isSignupSuccess } = useSignup();

  const navigate = useNavigate();

  useEffect(() => {
    if (isSignupSuccess) navigate("/login");
  }, [isSignupSuccess]);

  return (
    <ColoredContainer>
      <AuthCard onSubmit={signup} isLoading={isSignupPending} isSignup />
    </ColoredContainer>
  );
};

export default SignupPage;
