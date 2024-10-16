import { Box, Stack } from "@mui/material";
import MessageInputSection from "./MessageInputSection";
import useSendMessage, { IMessageInput } from "../hooks/useSendMessage";
import MessagesList from "./MessagesList";
import { IConversation } from "../hooks/useConversation";
import { IUserSnapshot } from "../hooks/useFriends";
import { useEffect, useState } from "react";
import { useSocketContext } from "../providers/SocketProvider";
import useUserEnteredConversation from "../hooks/useUserEnteredConversation";
import { useDropzone } from "react-dropzone";
import mime from "mime";
import DropArea from "./DropArea";

interface Props {
  conversation: IConversation;
}

const ChatBox = ({ conversation }: Props) => {
  const { sendMessage } = useSendMessage(conversation._id);
  const socket = useSocketContext();
  const [showDropArea, setShowDropArea] = useState(false);

  useUserEnteredConversation(conversation._id);

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
    <Stack padding={2} flex={1} {...getRootProps()} overflow="hidden">
      {showDropArea && <DropArea />}
      <MessagesList conversation={conversation} />
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
  );
};

export default ChatBox;
