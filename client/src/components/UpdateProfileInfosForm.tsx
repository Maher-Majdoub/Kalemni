import {
  Stack,
  Typography,
  TextField,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  CircularProgress,
} from "@mui/material";
import useUpdateProfileInfos from "../hooks/useUpdateProfileInfos";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import useProfile, { IProfileInfos } from "../hooks/useProfile";

const UpdateProfileInfosForm = () => {
  const { profile } = useProfile();
  const queryClient = useQueryClient();
  const { updateProfileInfos, isUpdateProfileInfosPending } =
    useUpdateProfileInfos(queryClient);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit((data) => {
    if (data.birthDate === "") data.birthDate = null;
    updateProfileInfos({ data: data as IProfileInfos });
  });

  const validateBirthdate = (value: any) => {
    const today = new Date();
    const birthdate = new Date(value);
    const age = today.getFullYear() - birthdate.getFullYear();

    if (age < 6 || age > 90) return "Please enter a valid birth date";
    return true;
  };

  const getFormatedDate = (value: any) => {
    if (!value) return "2000-01-01";
    const date = new Date(value);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <Stack spacing={1}>
          <Typography textAlign="center" fontSize={19} fontWeight={600}>
            Profile Infos
          </Typography>
          <TextField
            label="First Name"
            defaultValue={profile?.firstName}
            {...register("firstName", {
              required: { value: true, message: "First name is required" },
            })}
            error={!!errors.firstName}
            helperText={errors.firstName?.message?.toString()}
          />
          <TextField
            label="Last Name"
            defaultValue={profile?.lastName}
            {...register("lastName", {
              required: { value: true, message: "Last name is required" },
            })}
            error={!!errors.lastName}
            helperText={errors.lastName?.message?.toString()}
          />
          <TextField
            label="Bio"
            defaultValue={profile?.bio}
            {...register("bio", {
              maxLength: {
                value: 40,
                message: "Bio length should not exceed 40 characters",
              },
            })}
            error={!!errors.bio}
            helperText={errors.bio?.message?.toString()}
          />
          <TextField
            type="date"
            label="Birth Date"
            defaultValue={getFormatedDate(profile?.birthDate)}
            {...register("birthDate", { validate: validateBirthdate })}
            error={!!errors.birthDate}
            helperText={errors.birthDate?.message?.toString()}
          />
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            {...register("gender")}
          >
            <FormLabel id="demo-radio-buttons-group-label">Gender:</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue={profile?.gender || "m"}
              name="radio-buttons-group"
            >
              <Stack direction="row">
                <FormControlLabel value="m" control={<Radio />} label="Male" />
                <FormControlLabel
                  value="f"
                  control={<Radio />}
                  label="Female"
                />
              </Stack>
            </RadioGroup>
          </Stack>
          <Button
            variant="contained"
            type="submit"
            disabled={isUpdateProfileInfosPending}
          >
            {isUpdateProfileInfosPending ? (
              <CircularProgress size={25} />
            ) : (
              "Update Profile Infos"
            )}
          </Button>
        </Stack>
      </form>
    </>
  );
};

export default UpdateProfileInfosForm;
