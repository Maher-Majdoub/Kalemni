import { Avatar, Box, Divider, Stack, Typography } from "@mui/material";
import ChatBox from "../components/ChatBox";
import OnlineBadge from "../components/OnlineBadge";
import { useContext } from "react";
import { OnlineFriendsContext } from "../providers/OnlineFriendsProvider";
import useProfile from "../hooks/useProfile";
import userTestImage from "../assets/user_test_image.png";
import defaultUserIcon from "../assets/default_user_icon.png";

const MessagesPage = () => {
  const onlineFriends = useContext(OnlineFriendsContext);
  const { profile, isGetProfilePending } = useProfile();

  if (isGetProfilePending) return <h1>Stana...</h1>;

  if (profile)
    return (
      <Stack direction="row" height="100%" width="100%">
        <Box width="300px" sx={{ backgroundColor: "#fafafe" }}>
          <Box padding={3}>
            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
              <Avatar src={userTestImage} />
              <Stack>
                <Typography variant="body1">
                  {profile.firstName} {profile.lastName}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  My account
                </Typography>
              </Stack>
            </Stack>
          </Box>
          <Divider />
          <Stack spacing={2} padding={3} width="100%">
            <Stack spacing={1}>
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
                  <OnlineBadge
                    key={onlineFriend._id}
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                  >
                    <Avatar
                      src={onlineFriend.profilePicture || defaultUserIcon}
                    />
                    <Typography>{onlineFriend.firstName}</Typography>
                  </OnlineBadge>
                ))}
              </Stack>
            </Stack>
            <Stack spacing={1}>
              <Typography variant="subtitle1">Messages</Typography>
            </Stack>
          </Stack>
        </Box>
        <ChatBox conversationId={"me"} />
      </Stack>
    );
};

export default MessagesPage;
