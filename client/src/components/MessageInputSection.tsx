import { Paper, Stack, IconButton, Box } from "@mui/material";
import { BsSendFill } from "react-icons/bs";
import { GrAttachment } from "react-icons/gr";
import { PiMicrophone } from "react-icons/pi";
import { useEffect, useRef, useState } from "react";
import { useSocketContext } from "../providers/SocketProvider";
import { IMessageInput } from "../hooks/useSendMessage";
import AudioRecordInput from "./AudioRecordInput";

interface Props {
  conversationId: string;
  onOpenFileDialog(): void;
  onSendMessage(data: IMessageInput): void;
}

const MessageInputSection = ({
  conversationId,
  onSendMessage,
  onOpenFileDialog,
}: Props) => {
  const [isWritting, setIsWritting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const socket = useSocketContext();
  const messageInputRef = useRef<HTMLInputElement>(null);

  const handleInputChanges = (currValue: string) => {
    if (currValue && !isWritting)
      socket?.emit("startTyping", { conversationId: conversationId });

    if (!currValue && isWritting)
      socket?.emit("stopTyping", { conversationId: conversationId });

    setIsWritting(!!currValue);
  };

  const onSubmit = () => {
    const message = messageInputRef.current?.value.trim();

    if (!message || !messageInputRef.current) return;

    onSendMessage({ content: message, type: "text" });
    messageInputRef.current.value = "";
    handleInputChanges("");
  };

  useEffect(() => {
    return () => {
      if (isWritting) {
        socket?.emit("stopTyping", { conversationId: conversationId });
      }
    };
  }, []);

  return (
    <Paper
      elevation={5}
      sx={{ padding: 1, margin: "5px 0 0", borderRadius: 3 }}
    >
      {!isRecording && (
        <Stack direction="row" spacing={1}>
          <IconButton
            children={<PiMicrophone />}
            size="small"
            onClick={() => setIsRecording(true)}
          />
          <IconButton
            children={<GrAttachment />}
            size="small"
            onClick={onOpenFileDialog}
          />
          <Box bgcolor="lightgray" width="100%" padding="2px" borderRadius={3}>
            <form
              autoComplete="off"
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
              }}
            >
              <input
                type="text"
                ref={messageInputRef}
                placeholder="Your Message..."
                onChange={(e) => handleInputChanges(e.currentTarget.value)}
              />
            </form>
          </Box>
          {isWritting && (
            <IconButton
              children={<BsSendFill />}
              size="small"
              color="primary"
              onClick={onSubmit}
            />
          )}
        </Stack>
      )}
      {isRecording && (
        <AudioRecordInput
          conversationId={conversationId}
          onEnd={() => {
            setIsRecording(false);
          }}
        />
      )}
    </Paper>
  );
};

export default MessageInputSection;
