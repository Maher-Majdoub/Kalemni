import { ReactNode } from "react";
import { IUserSnapshot } from "../hooks/useFriends";
import { Box, Stack, Typography } from "@mui/material";
import defaultProfilePicture from "../assets/default_profile_picture.jpg";

interface Props {
  user: IUserSnapshot;
  children?: ReactNode;
}

const UserCard = ({ user, children }: Props) => {
  return (
    <Stack boxShadow="0 0 8px 2px #eee" borderRadius={2} overflow="hidden">
      <Box textAlign="center" height="200px">
        <img src={user.profilePicture || defaultProfilePicture} />
      </Box>
      <Stack spacing={1} padding={2}>
        <Typography variant="h6">
          {user.firstName} {user.lastName}
        </Typography>
        {children}
      </Stack>
    </Stack>
  );
};

export default UserCard;
