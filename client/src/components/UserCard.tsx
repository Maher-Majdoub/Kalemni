import { ReactNode } from "react";
import { IUserSnapshot } from "../hooks/useFriends";
import { Box, Card, Stack, Typography } from "@mui/material";
import defaultProfilePicture from "../assets/default_profile_picture.jpg";

interface Props {
  user: IUserSnapshot;
  children?: ReactNode;
}

const UserCard = ({ user, children }: Props) => {
  return (
    <Box>
      <Card>
        <Stack>
          <Box textAlign="center">
            <img src={user.profilePicture || defaultProfilePicture} />
          </Box>
          <Stack spacing={1} padding={2}>
            <Typography variant="h6">
              {user.firstName} {user.lastName}
            </Typography>
            {children}
          </Stack>
        </Stack>
      </Card>
    </Box>
  );
};

export default UserCard;
