import { Grid2 } from "@mui/material";
import useNewFriends from "../hooks/useNewFriends";
import UserCard from "./UserCard";

const NewFriendsList = () => {
  const { newFriends, isGetNewFriendsSuccess } = useNewFriends();

  if (isGetNewFriendsSuccess) {
  }
  return (
    <Grid2 container spacing={2}>
      {newFriends?.map((friend) => (
        <Grid2 key={friend._id}>
          <UserCard user={friend} />
        </Grid2>
      ))}
    </Grid2>
  );
};

export default NewFriendsList;
