import { Stack, IconButton } from "@mui/material";
import { useRef, useEffect } from "react";
import { BsSendFill } from "react-icons/bs";
import { TbTrash } from "react-icons/tb";
import useSendMessage from "../hooks/useSendMessage";

interface Props {
  conversationId: string;
  onEnd(): void;
}

const AudioRecordInput = ({ conversationId, onEnd }: Props) => {
  let audioChunks: Blob[] = [];
  const { sendMessage } = useSendMessage(conversationId, "audio");
  const mediaRecorderRef = useRef<MediaRecorder>();
  let sendRecord = false;

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (e) =>
        audioChunks.push(e.data);

      mediaRecorderRef.current.start();

      mediaRecorderRef.current.onstop = () => {
        if (sendRecord) {
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          sendMessage({ type: "audio", content: "", audio: audioBlob });
        }
        audioChunks = [];
      };
    } catch (ex) {
      console.log(ex);
    }
  };

  const stopRecording = (send: boolean) => {
    sendRecord = send;
    mediaRecorderRef.current?.stop();
    onEnd();
  };

  useEffect(() => {
    startRecording();
  }, []);

  return (
    <Stack direction="row" alignItems="center" spacing={3}>
      <IconButton
        children={<TbTrash />}
        size="small"
        color="primary"
        type="submit"
        onClick={() => {
          stopRecording(false);
        }}
      />
      <p>Recording....</p>
      <IconButton
        children={<BsSendFill />}
        size="small"
        color="primary"
        type="submit"
        onClick={() => {
          stopRecording(true);
        }}
      />
    </Stack>
  );
};

export default AudioRecordInput;
