import { Box } from "@mui/material";
import useFriendRequests from "../hooks/useFriendRequests";
import FriendRequestCard from "./FriendRequestCard";

const FriendRequestsList = () => {
  const { friendRequests } = useFriendRequests();

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
      {friendRequests?.map((friendRequest) => (
        <FriendRequestCard
          key={friendRequest._id}
          user={friendRequest.user}
          requestId={friendRequest._id}
        />
      ))}
    </Box>
  );
};

export default FriendRequestsList;
