import { Box, Stack, Avatar, Typography, Divider } from "@mui/material";
import useProfile from "../hooks/useProfile";
import userTestImage from "../assets/user_test_image.png";

const ProfileSection = () => {
  const { profile } = useProfile();
  return (
    <>
      <Box padding={3}>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Avatar src={userTestImage} />
          <Stack>
            <Typography variant="body1">
              {profile?.firstName} {profile?.lastName}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              My account
            </Typography>
          </Stack>
        </Stack>
      </Box>
      <Divider />
    </>
  );
};

export default ProfileSection;
