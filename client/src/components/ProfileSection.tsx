import {
  Box,
  Stack,
  Avatar,
  Typography,
  Divider,
  ButtonBase,
} from "@mui/material";
import useProfile from "../hooks/useProfile";
import ProfileSnapshotSkeleton from "./Skeletons/ProfileSnapshotSkeleton";
import OnlineBadge from "./OnlineBadge";
import { useNavigate } from "react-router-dom";

const ProfileSection = () => {
  const { profile, isGetProfilePending } = useProfile();
  const navigate = useNavigate();

  return (
    <>
      <Box>
        {isGetProfilePending && <ProfileSnapshotSkeleton />}
        {profile && (
          <ButtonBase
            sx={{ width: "100%" }}
            onClick={() => navigate("/settings")}
          >
            <Stack
              direction="row"
              spacing={2}
              padding={2}
              alignItems="center"
              justifyContent="start"
              width="100%"
            >
              <OnlineBadge setOnline>
                <Avatar src={profile?.profilePicture} />
              </OnlineBadge>
              <Stack textAlign="start">
                <Typography variant="body1">
                  {profile?.firstName} {profile?.lastName}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  My account
                </Typography>
              </Stack>
            </Stack>
          </ButtonBase>
        )}
      </Box>
      <Divider />
    </>
  );
};

export default ProfileSection;
