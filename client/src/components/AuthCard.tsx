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
import googleIcon from "../assets/google_icon.png";

interface Props {
  onSubmit(data: any): void;
  onGoogleLogin(): void;
  isLoading: boolean;
  isSignup?: boolean;
}

const AuthCard = ({
  onSubmit,
  onGoogleLogin,
  isLoading,
  isSignup = false,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
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
                    minLength: {
                      value: 3,
                      message: "First name length should be between 3 and 20",
                    },
                    maxLength: {
                      value: 20,
                      message: "First name length should be between 3 and 20",
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
                    minLength: {
                      value: 3,
                      message: "Last name length should be between 3 and 20",
                    },
                    maxLength: {
                      value: 20,
                      message: "Last name length should be between 3 and 20",
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
                minLength: {
                  value: 5,
                  message: "Username length should be between 5 and 30",
                },
                maxLength: {
                  value: 30,
                  message: "Username length should be between 5 and 30",
                },
              })}
              label="Username"
              helperText={errors.username?.message?.toString()}
              error={!!errors.username}
            />
            <TextField
              {...register("password", {
                required: { message: "This field is required", value: true },
                minLength: {
                  value: 5,
                  message: "Password length should be between 5 and 30",
                },
                maxLength: {
                  value: 30,
                  message: "Password length should be between 5 and 30",
                },
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
          variant="outlined"
          startIcon={<img src={googleIcon} width={25} />}
          sx={{
            color: "gray",
            borderColor: "gray",
            ".MuiButton-startIcon": { position: "absolute", left: "20px" },
          }}
          onClick={onGoogleLogin}
        >
          Login with Google
        </Button>
      </Stack>
    </Box>
  );
};

export default AuthCard;
