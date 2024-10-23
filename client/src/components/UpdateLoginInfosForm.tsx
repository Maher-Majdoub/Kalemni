import {
  Stack,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useUpdateLoginInfos, {
  IUpdateLoginInfoInput,
} from "../hooks/useUpdateLoginInfos";
import { useEffect } from "react";

const UpdateLoginInfosForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const {
    updateLoginInfos,
    isUpdateLoginInfosSuccess,
    isUpdateLoginInfosPending,
  } = useUpdateLoginInfos();

  const onSubmit = handleSubmit((data) => {
    if (!data.newPassword && !data.newUsername)
      return toast.error("You should update at least one field");

    updateLoginInfos({ data: data } as IUpdateLoginInfoInput);
  });

  useEffect(() => {
    if (isUpdateLoginInfosSuccess) {
      reset();
    }
  }, [isUpdateLoginInfosSuccess]);

  return (
    <form onSubmit={onSubmit}>
      <Stack spacing={1} height="100%" justifyContent="center">
        <Typography textAlign="center" fontSize={19} fontWeight={600}>
          Login Infos
        </Typography>
        <TextField label="New User Name" {...register("newUsername")} />
        <TextField
          label="New Password"
          type="password"
          {...register("newPassword")}
        />
        <TextField
          label="Old Password"
          type="password"
          {...register("oldPassword", {
            required: { value: true, message: "Old password is required" },
          })}
          error={!!errors.oldPassword}
          helperText={errors.oldPassword?.message?.toString()}
        />
        <Button
          variant="contained"
          type="submit"
          disabled={isUpdateLoginInfosPending}
        >
          {isUpdateLoginInfosPending ? (
            <CircularProgress size={25} />
          ) : (
            "Update Login Infos"
          )}
        </Button>
      </Stack>
    </form>
  );
};

export default UpdateLoginInfosForm;
