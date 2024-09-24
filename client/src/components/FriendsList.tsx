import useFriends from "../hooks/useFriends";
import { Box } from "@mui/material";

const FriendsList = () => {
  const { friends, isGetFriendsSuccess } = useFriends();

  return (
    <Box>
      {isGetFriendsSuccess &&
        friends &&
        friends.map((friend) => <p key={friend._id}>{friend.firstName}</p>)}
    </Box>
  );
};

export default FriendsList;
