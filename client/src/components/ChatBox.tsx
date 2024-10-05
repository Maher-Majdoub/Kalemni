import { Box, Stack } from "@mui/material";
import MessageInputSection from "./MessageInputSection";
import ConversationHeader from "./ConversationHeader";
import useSendMessage from "../hooks/useSendMessage";
import MessagesList from "./MessagesList";
import useConversation from "../hooks/useConversation";
import { IUserSnapshot } from "../hooks/useFriends";
import { useEffect } from "react";
import { socket } from "../App";

interface Props {
  conversationId: string;
}

const ChatBox = ({ conversationId }: Props) => {
  const { conversation } = useConversation(conversationId);
  const { sendMessage } = useSendMessage(conversationId);

  useEffect(() => {
    if (conversation && conversation.messages)
      socket.emit("seenMessage", {
        conversationId: conversation._id,
        messageId: conversation.messages[0]._id,
      });
  }, [conversation]);

  if (!conversation) return <p>wait....</p>;

  const typingUsers = [] as IUserSnapshot[];
  for (const participant of conversation.participants) {
    if (participant.isTyping) typingUsers.push(participant.user);
  }
  return (
    <Box width="100%" height="100%">
      <Stack height="100%">
        <ConversationHeader conversation={conversation} />
        <Box padding={2} sx={{ flex: 1, overflow: "auto" }}>
          <MessagesList conversation={conversation} />
        </Box>
        {typingUsers.map((user) => (
          <Box key={user._id}>{`${user.firstName} is typing...`}</Box>
        ))}
        <MessageInputSection
          conversationId={conversation._id}
          onSendMessage={sendMessage}
        />
      </Stack>
    </Box>
  );
};

export default ChatBox;
