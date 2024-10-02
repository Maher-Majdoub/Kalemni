import { Stack, Box } from "@mui/material";
import { IMessage } from "../hooks/useConversation";
import MessageBox from "./MessageBox";

interface Props {
  messages: IMessage[];
}

const MessagesList = ({ messages }: Props) => {
  return (
    <Stack
      spacing={0.8}
      flexDirection="column-reverse"
      alignItems="flex-end"
      height="100%"
      overflow="auto"
    >
      {messages.map((message) => (
        <Box
          alignSelf={message.sentByMe ? "flex-end" : "flex-start"}
          key={message._id}
        >
          <MessageBox
            key={message._id}
            messages={[message]}
            user={message.sender}
          />
        </Box>
      ))}
    </Stack>
  );
};

export default MessagesList;
