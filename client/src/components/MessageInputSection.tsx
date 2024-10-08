import { Paper, Stack, IconButton, Box } from "@mui/material";
import { BiSolidLike } from "react-icons/bi";
import { BsSendFill } from "react-icons/bs";
import { FaSmile } from "react-icons/fa";
import { GrAttachment } from "react-icons/gr";
import { PiMicrophone } from "react-icons/pi";
import { useForm } from "react-hook-form";
import { useState } from "react";
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
  const { register, handleSubmit, setValue } = useForm();
  const [isWritting, setIsWritting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const socket = useSocketContext();

  const handleInputChanges = (currValue: string) => {
    if (!socket) return;

    if (currValue && !isWritting)
      socket.emit("startTyping", { conversationId: conversationId });

    if (!currValue && isWritting)
      socket.emit("stopTyping", { conversationId: conversationId });

    setIsWritting(!!currValue);
  };

  const onSubmit = handleSubmit((data) => {
    onSendMessage({ content: data.message, type: "text" });
    setValue("message", "");
    handleInputChanges("");
  });

  return (
    <Paper elevation={5} sx={{ padding: 1, margin: "8px 0", borderRadius: 3 }}>
      {!isRecording && (
        <Stack direction="row" spacing={1}>
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
          </Stack>
          <Box width="100%">
            <form autoComplete="off" onSubmit={onSubmit}>
              <Stack direction="row" spacing={1}>
                <Stack
                  direction="row"
                  bgcolor="lightgray"
                  width="100%"
                  padding="2px"
                  borderRadius={3}
                >
                  <input
                    {...register("message", { required: true })}
                    type="text"
                    autoComplete=""
                    placeholder="Your Message..."
                    onChange={(e) => handleInputChanges(e.currentTarget.value)}
                  />
                  <IconButton
                    children={<FaSmile />}
                    size="small"
                    color="primary"
                  />
                </Stack>
                {isWritting ? (
                  <IconButton
                    children={<BsSendFill />}
                    size="small"
                    color="primary"
                    type="submit"
                  />
                ) : (
                  <IconButton
                    children={<BiSolidLike />}
                    size="small"
                    color="primary"
                  />
                )}
              </Stack>
            </form>
          </Box>
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
