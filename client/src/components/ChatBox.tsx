import { Box, Stack } from "@mui/material";
import MessageInputSection from "./MessageInputSection";
import ConversationHeader from "./ConversationHeader";
import useSendMessage from "../hooks/useSendMessage";
import MessagesList from "./MessagesList";
import useConversation from "../hooks/useConversation";

interface Props {
  conversationId: string;
}

const ChatBox = ({ conversationId }: Props) => {
  const { conversation } = useConversation(conversationId);
  const { sendMessage } = useSendMessage(conversationId);

  if (!conversation) return <p>wait....</p>;

  return (
    <Box width="100%" height="100%">
      <Stack height="100%">
        <ConversationHeader conversation={conversation} />
        <Box padding={2} sx={{ flex: 1, overflow: "auto" }}>
          <MessagesList messages={conversation.messages} />
        </Box>
        <MessageInputSection onSendMessage={sendMessage} />
      </Stack>
    </Box>
  );
};

export default ChatBox;
