import { useEffect, useRef } from "react";
import useLogin from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { login, isLoginSuccess, isLoginPending, isLoginError } = useLogin();
  const navigate = useNavigate();

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const extractInput = () => {
    if (usernameRef.current?.value && passwordRef.current?.value)
      return {
        username: usernameRef.current.value,
        password: passwordRef.current.value,
      };
    return { username: "", password: "" };
  };

  useEffect(() => {
    if (isLoginSuccess) {
      navigate("/");
    }
  }, [isLoginSuccess]);

  if (isLoginError) {
    console.log("invalid login");
  }

  return (
    <>
      <main>
        <h1>Login</h1>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            login(extractInput());
          }}
        >
          <input type="text" placeholder="Username" ref={usernameRef} /> <br />
          <input type="password" placeholder="Password" ref={passwordRef} />
          <br />
          <button disabled={isLoginPending}>
            Login{isLoginPending && "...."}
          </button>
        </form>
      </main>
    </>
  );
};

export default LoginPage;
