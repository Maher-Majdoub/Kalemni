import { Avatar, Box, Stack, Typography } from "@mui/material";
import { IMessage } from "../hooks/useConversation";
import defaultUserIcon from "../assets/default_user_icon.png";

interface Props {
  message: IMessage;
  isNewMessagesGroup: boolean;
}

const MessageBox = ({ message, isNewMessagesGroup }: Props) => {
  return (
    <Stack spacing={1} direction="row">
      <Avatar
        src={message.sender.profilePicture || defaultUserIcon}
        sx={{
          alignSelf: "flex-end",
          width: 30,
          height: 30,
          opacity: isNewMessagesGroup && !message.sentByMe ? 1 : 0,
        }}
      />
      <Box
        key={message._id}
        padding="5px 10px"
        color="white"
        width="fit-content"
        alignSelf={message.sentByMe ? "flex-end" : "flex-start"}
        sx={{
          backgroundColor: "#3559FF",
          borderRadius: "8px",
        }}
      >
        <Typography>{message.content}</Typography>
      </Box>
    </Stack>
  );
};

export default MessageBox;
