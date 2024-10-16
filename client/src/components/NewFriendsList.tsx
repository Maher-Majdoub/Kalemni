import { Box } from "@mui/material";
import useNewFriends from "../hooks/useNewFriends";
import NewFriendCard from "./NewFriendCard";

const NewFriendsList = () => {
  const { newFriends } = useNewFriends();

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: 2,
      }}
      flex={1}
      overflow="auto"
    >
      {newFriends?.map((friend) => (
        <NewFriendCard user={friend} key={friend._id} />
      ))}
    </Box>
  );
};

export default NewFriendsList;
