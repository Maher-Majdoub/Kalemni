import { Box, Stack } from "@mui/material";
import MessageInputSection from "./MessageInputSection";
import ConversationHeader from "./ConversationHeader";
import useSendMessage, { IMessageInput } from "../hooks/useSendMessage";
import MessagesList from "./MessagesList";
import useConversation from "../hooks/useConversation";
import { IUserSnapshot } from "../hooks/useFriends";
import { useEffect, useState } from "react";
import { useSocketContext } from "../providers/SocketProvider";
import useUserEnteredConversation from "../hooks/useUserEnteredConversation";
import { useDropzone } from "react-dropzone";
import DropArea from "./DropArea";
import mime from "mime";

const ChatBox = ({ conversationId }: { conversationId: string }) => {
  const { conversation } = useConversation(conversationId);
  const { sendMessage } = useSendMessage(conversationId);
  const socket = useSocketContext();
  const [showDropArea, setShowDropArea] = useState(false);

  useUserEnteredConversation(conversationId);

  useEffect(() => {
    if (conversation && conversation.messages.length && socket)
      socket.emit("sawMessage", {
        conversationId: conversation._id,
        messageId: conversation.messages[0]._id,
      });
  }, [conversation, socket]);

  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    accept: {
      "image/*": [],
      "audio/*": [],
      "video/*": [],
    },

    onDropAccepted(files) {
      files.forEach((file) => {
        const fileType = mime.getType(file.name);

        if (fileType) {
          const type = fileType.split("/")[0];

          if (type === "audio" || type === "video" || type === "image") {
            const message: IMessageInput = {
              content: "",
              type: type,
            };

            if (type === "audio") message.audio = file;
            if (type === "video") message.video = file;
            if (type === "image") message.image = file;

            sendMessage(message);
          }
        }
      });
    },

    onDragEnter() {
      if (!showDropArea) setShowDropArea(true);
    },
    onDragLeave() {
      if (showDropArea) setShowDropArea(false);
    },
  });

  if (!conversation) return <p>wait....</p>;

  const typingUsers = [] as IUserSnapshot[];
  for (const participant of conversation.participants) {
    if (participant.isTyping) typingUsers.push(participant.user);
  }

  return (
    <Box width="100%" height="100%" {...getRootProps()}>
      <Stack height="100%" sx={{ position: "relative" }}>
        {showDropArea && <DropArea />}
        <ConversationHeader conversation={conversation} />
        <Box padding={2} sx={{ flex: 1, overflow: "auto" }}>
          <MessagesList conversation={conversation} />
        </Box>
        {typingUsers.map((user) => (
          <Box key={user._id}>{`${user.firstName} is typing...`}</Box>
        ))}
        <MessageInputSection
          conversationId={conversation._id}
          onOpenFileDialog={open}
          onSendMessage={sendMessage}
        />
        <input {...getInputProps()} />
      </Stack>
    </Box>
  );
};

export default ChatBox;
