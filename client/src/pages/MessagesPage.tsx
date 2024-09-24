// import { io } from "socket.io-client";
import { Avatar, Box, Divider, Stack, Typography } from "@mui/material";
import userTestImage from "../assets/user_test_image.png";
import ChatBox from "../components/ChatBox";
import OnlineBadge from "../components/OnlineBadge";

// const socket = io("http://localhost:3000", {
//   auth: {
//     authToken: localStorage.getItem("auth-token"),
//   },
// });

// if (socket) {
// }

const MessagesPage = () => {
  return (
    <Stack direction="row" height="100%" width="100%">
      <Box width="300px" sx={{ backgroundColor: "#fafafe" }}>
        <Box padding={3}>
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <Avatar src={userTestImage} />
            <Stack>
              <Typography variant="body1">Flen Fouleni</Typography>
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
              sx={{ overflowX: "auto", overflowY: "hidden", padding: "5px 0" }}
            >
              <OnlineBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar src={userTestImage} />
              </OnlineBadge>
              <OnlineBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar src={userTestImage} />
              </OnlineBadge>
              <OnlineBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar src={userTestImage} />
              </OnlineBadge>
              <OnlineBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar src={userTestImage} />
              </OnlineBadge>
              <OnlineBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar src={userTestImage} />
              </OnlineBadge>
              <OnlineBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar src={userTestImage} />
              </OnlineBadge>
              <OnlineBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar src={userTestImage} />
              </OnlineBadge>
              <OnlineBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar src={userTestImage} />
              </OnlineBadge>
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
