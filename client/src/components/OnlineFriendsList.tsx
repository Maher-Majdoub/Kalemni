import { useContext } from "react";
import { OnlineFriendsContext } from "../providers/OnlineFriendsProvider";
import { Stack, Avatar } from "@mui/material";
import defaultUserIcon from "../assets/default_user_icon.png";
import OnlineBadge from "./OnlineBadge";

const OnlineFriendsList = () => {
  const onlineFriends = useContext(OnlineFriendsContext);
  return (
    <Stack
      spacing={1}
      direction="row"
      sx={{
        overflowX: "auto",
        overflowY: "hidden",
        padding: "5px 0",
      }}
    >
      {Array.from(onlineFriends).map((onlineFriend) => (
        <OnlineBadge isConnected key={onlineFriend._id}>
          <Avatar src={onlineFriend.profilePicture || defaultUserIcon} />
        </OnlineBadge>
      ))}
    </Stack>
  );
};

export default OnlineFriendsList;
