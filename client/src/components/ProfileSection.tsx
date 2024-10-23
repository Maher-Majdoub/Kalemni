import { Box, Stack, Avatar, Typography, Divider } from "@mui/material";
import useProfile from "../hooks/useProfile";

const ProfileSection = () => {
  const { profile } = useProfile();

  if (!profile) return <p>Wait...</p>;

  return (
    <>
      <Box padding={3}>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Avatar src={profile.profilePicture} />
          <Stack>
            <Typography variant="body1">
              {profile.firstName} {profile.lastName}
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
