import { useForm } from "react-hook-form";
import {
  Box,
  Stack,
  Typography,
  FormControl,
  TextField,
  Button,
  Divider,
  Link,
  CircularProgress,
} from "@mui/material";
import facebookIcon from "../assets/facebook_icon.png";
import googleIcon from "../assets/google_icon.png";
import { useGoogleLogin } from "@react-oauth/google";
import useSendGoogleLogin from "../hooks/useSendGoogleLogin";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  onSubmit(data: any): void;
  onGoogleLogin(): void;
  isLoading: boolean;
  isSignup?: boolean;
}

const AuthCard = ({ onSubmit, isLoading, isSignup = false }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { sendGoogleLogin, isSendGoolgeLoginSuccess } = useSendGoogleLogin();
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: async (data) => {
      sendGoogleLogin({ accessToken: data.access_token });
    },
  });

  useEffect(() => {
    if (isSendGoolgeLoginSuccess) {
      return navigate("/");
    }
  }, [isSendGoolgeLoginSuccess]);

  return (
    <Box
      padding={3}
      margin={3}
      boxShadow="0 0 20px 0px #000000ab"
      borderRadius={4}
      width="100%"
      maxWidth="500px"
      sx={{ backgroundColor: "#FFFFFF" }}
    >
      <Stack spacing={2}>
        <Typography variant="h4" textAlign="center" sx={{ paddingBottom: 2 }}>
          {isSignup ? "Signup" : "Login"}
        </Typography>
        <form onSubmit={handleSubmit((data) => onSubmit(data))}>
          <FormControl fullWidth sx={{ gap: "15px" }}>
            {isSignup && (
              <>
                <TextField
                  {...register("firstName", {
                    required: {
                      message: "This field is required",
                      value: true,
                    },
                  })}
                  label="First Name"
                  helperText={errors.firstName?.message?.toString()}
                  error={!!errors.firstName}
                />
                <TextField
                  {...register("lastName", {
                    required: {
                      message: "This field is required",
                      value: true,
                    },
                  })}
                  label="Last Name"
                  helperText={errors.firstName?.message?.toString()}
                  error={!!errors.firstName}
                />
              </>
            )}
            <TextField
              {...register("username", {
                required: { message: "This field is required", value: true },
              })}
              label="Username"
              helperText={errors.username?.message?.toString()}
              error={!!errors.username}
            />
            <TextField
              {...register("password", {
                required: { message: "This field is required", value: true },
              })}
              label="Password"
              type="password"
              helperText={errors.password?.message?.toString()}
              error={!!errors.password}
            />
            <Button variant="contained" type="submit">
              {isLoading ? (
                <CircularProgress size="24px" color="inherit" />
              ) : isSignup ? (
                "Singup"
              ) : (
                "Login"
              )}
            </Button>
          </FormControl>
        </form>
        {isSignup && (
          <Typography textAlign="center">
            Already have an account? <Link href="/Login">Login</Link>
          </Typography>
        )}
        {!isSignup && (
          <Typography textAlign="center">
            Don't have an account? <Link href="/Signup">Signup</Link>
          </Typography>
        )}
        <Divider sx={{ color: "gray" }}>Or</Divider>
        <Button
          variant="contained"
          startIcon={<img src={facebookIcon} width={25} />}
          sx={{
            ".MuiButton-startIcon": { position: "absolute", left: "20px" },
          }}
        >
          Login with Facebook
        </Button>
        <Button
          variant="outlined"
          startIcon={<img src={googleIcon} width={25} />}
          sx={{
            color: "gray",
            borderColor: "gray",
            ".MuiButton-startIcon": { position: "absolute", left: "20px" },
          }}
          onClick={() => {
            googleLogin();
          }}
        >
          Login with Google
        </Button>
      </Stack>
    </Box>
  );
};

export default AuthCard;
