import { Avatar, Box, Stack, Typography } from "@mui/material";
import { IMessage } from "../hooks/useConversation";

interface Props {
  message: IMessage;
  isNewMessagesGroup: boolean;
  isFirstMessage: boolean;
}

const MessageBox = ({ message, isNewMessagesGroup, isFirstMessage }: Props) => {
  return (
    <Stack>
      <Stack spacing={1} direction="row">
        {!message.sentByMe && (
          <Avatar
            src={message.sender.profilePicture}
            sx={{
              alignSelf: "flex-end",
              width: 30,
              height: 30,
              opacity: isNewMessagesGroup ? 1 : 0,
            }}
          />
        )}
        <Stack width="100%">
          {!message.sentByMe && isFirstMessage && (
            <Typography variant="caption" color="gray" fontSize={9}>
              {message.sender.firstName}
            </Typography>
          )}
          <Box
            key={message._id}
            color="white"
            alignSelf={message.sentByMe ? "flex-end" : "flex-start"}
            borderRadius={2}
            sx={{
              backgroundColor: message.type === "text" ? "#3559FF" : "white",
              overflow: "hidden",
            }}
            maxWidth="80%"
          >
            {message.type === "text" && (
              <Typography padding="5px 10px" sx={{ overflowWrap: "anywhere" }}>
                {message.content}
              </Typography>
            )}
            {message.type === "audio" && (
              <audio controls>
                <source src={message.content} type="audio/wav" />
              </audio>
            )}
            {message.type === "image" && (
              <img width="100%" src={message.content} />
            )}

            {message.type === "video" && (
              <video src={message.content} width="100%" controls></video>
            )}
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default MessageBox;
