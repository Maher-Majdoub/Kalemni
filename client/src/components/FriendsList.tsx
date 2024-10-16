import { Box } from "@mui/material";
import useFriends from "../hooks/useFriends";
import UserCard from "./UserCard";

const FriendsList = () => {
  const { friends } = useFriends();

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: 2,
      }}
      padding={1}
      overflow="auto"
    >
      {friends &&
        friends.map((friend) => <UserCard key={friend._id} user={friend} />)}
    </Box>
  );
};

export default FriendsList;
