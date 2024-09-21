import { useEffect, useRef } from "react";
import useSignup from "../hooks/useSignup";
import { useNavigate } from "react-router-dom";

export const SignupPage = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);

  const { signup, isSignupSuccess, isSignupPending, isSignupError, error } =
    useSignup();

  const navigate = useNavigate();

  useEffect(() => {
    if (isSignupSuccess) navigate("/login");
  }, [isSignupSuccess]);

  if (isSignupError) {
    console.log(error);
  }

  return (
    <main>
      <h1>Signup Page</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          signup({
            username: usernameRef.current?.value as string,
            password: usernameRef.current?.value as string,
            firstName: firstNameRef.current?.value as string,
            lastName: lastNameRef.current?.value as string,
          });
        }}
      >
        <input type="text" placeholder="Username" ref={usernameRef} />
        <br />
        <input type="password" placeholder="Password" ref={passwordRef} />
        <br />
        <input type="text" placeholder="First Name" ref={firstNameRef} />
        <br />
        <input type="text" placeholder="Last Name" ref={lastNameRef} />
        <br />
        <button disabled={isSignupPending}>Signup</button>
      </form>
    </main>
  );
};

export default SignupPage;
