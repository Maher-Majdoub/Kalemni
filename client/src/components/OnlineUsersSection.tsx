import { Avatar, ButtonBase, Stack, Typography } from "@mui/material";
import { useContext } from "react";
import { OnlineFriendsContext } from "../providers/OnlineFriendsProvider";
import OnlineBadge from "./OnlineBadge";
import useConversations from "../hooks/useConversations";
import { useNavigate } from "react-router-dom";

const OnlineUsersSection = () => {
  const onlineFriends = useContext(OnlineFriendsContext);
  const { conversations } = useConversations();

  const navigate = useNavigate();

  const navigateToConversation = (userId: string) => {
    if (!conversations) return;
    for (const conversation of conversations) {
      if (
        conversation.participants.length === 1 &&
        conversation.participants[0].user._id === userId
      )
        return navigate(`/conversations/${conversation._id}`);
    }
  };

  return (
    <Stack spacing={1} paddingLeft={3} paddingRight={3}>
      <Typography variant="subtitle1">Online Now</Typography>
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
          <ButtonBase
            key={onlineFriend._id}
            onClick={() => navigateToConversation(onlineFriend._id)}
          >
            <OnlineBadge isConnected>
              <Avatar src={onlineFriend.profilePicture} />
            </OnlineBadge>
          </ButtonBase>
        ))}
      </Stack>
    </Stack>
  );
};

export default OnlineUsersSection;
