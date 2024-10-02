import { Avatar, Box, Stack, Typography } from "@mui/material";
import { IUserSnapshot } from "../hooks/useFriends";
import { IMessage } from "../hooks/useConversation";
import defaultUserIcon from "../assets/default_user_icon.png";

interface Props {
  user: IUserSnapshot;
  messages: IMessage[];
}

const MessageBox = ({ user, messages }: Props) => {
  return (
    <Box>
      <Stack spacing={1} direction="row">
        {!messages[0].sentByMe && (
          <Avatar
            src={user.profilePicture || defaultUserIcon}
            sx={{ alignSelf: "flex-end", width: 30, height: 30 }}
          />
        )}
        <Stack spacing={0.4} borderRadius={4} overflow="hidden">
          {messages.map((message) => (
            <Box
              sx={{
                backgroundColor: "#3559FF",
                borderRadius: "5px",
              }}
              padding="5px 10px"
              color="white"
              key={message._id}
            >
              <Typography>{message.content}</Typography>
            </Box>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};

export default MessageBox;
