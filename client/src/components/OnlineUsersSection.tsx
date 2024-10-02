import { Stack, Typography } from "@mui/material";
import OnlineFriendsList from "./OnlineFriendsList";

const OnlineUsersSection = () => {
  return (
    <Stack spacing={1} paddingLeft={3} paddingRight={3}>
      <Typography variant="subtitle1">Online Now</Typography>

      <OnlineFriendsList />
    </Stack>
  );
};

export default OnlineUsersSection;
