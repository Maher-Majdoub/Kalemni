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
        <Avatar
          src={message.sender.profilePicture}
          sx={{
            alignSelf: "flex-end",
            width: 30,
            height: 30,
            opacity: isNewMessagesGroup && !message.sentByMe ? 1 : 0,
          }}
        />
        <Stack>
          {!message.sentByMe && isFirstMessage && (
            <Typography variant="caption" color="gray" fontSize={9}>
              {message.sender.firstName}
            </Typography>
          )}
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
            {message.type === "text" && (
              <Typography>{message.content}</Typography>
            )}
            {message.type === "audio" && (
              <audio controls>
                <source
                  src={`http://localhost:3000${message.content}`}
                  type="audio/wav"
                />
              </audio>
            )}
            {message.type === "image" && (
              <img src={`http://localhost:3000${message.content}`} />
            )}

            {message.type === "video" && (
              <video
                src={`http://localhost:3000${message.content}`}
                controls
              ></video>
            )}
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default MessageBox;
