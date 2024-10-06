import { Card, Grid2, Stack, Typography } from "@mui/material";
import useFriends from "../hooks/useFriends";

const FriendsList = () => {
  const { friends, isGetFriendsSuccess } = useFriends();

  if (isGetFriendsSuccess) {
  }

  return (
    <Grid2 container spacing={2}>
      {friends &&
        friends.map((friend) => (
          <Grid2 key={friend._id}>
            <Card>
              <Stack>
                <img src={friend.profilePicture} width={200} />
                <Stack spacing={1} padding={2}>
                  <Typography variant="h6">
                    {friend.firstName} {friend.lastName}
                  </Typography>
                </Stack>
              </Stack>
            </Card>
          </Grid2>
        ))}
    </Grid2>
  );
};

export default FriendsList;
