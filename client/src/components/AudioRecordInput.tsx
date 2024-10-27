import { Stack, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { BsSendFill } from "react-icons/bs";
import { TbTrash } from "react-icons/tb";
import { LiveAudioVisualizer } from "react-audio-visualize";
import useSendMessage from "../hooks/useSendMessage";

interface Props {
  conversationId: string;
  onEnd(): void;
}

let sendRecord = false;

const AudioRecordInput = ({ conversationId, onEnd }: Props) => {
  let audioChunks: Blob[] = [];
  const { sendMessage } = useSendMessage(conversationId);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  const [recorded, setRecorded] = useState("");

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const newMediaRecorder = new MediaRecorder(stream);

      newMediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);

      newMediaRecorder.start();
      const startTime = Date.now();

      const recordingInterval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const seconds = Math.floor(elapsedTime / 1000);

        const s = seconds % 60;
        const m = Math.floor(seconds / 60);

        setRecorded(`${m <= 9 ? "0" : ""}${m}:${s <= 9 ? "0" : ""}${s}`);
      }, 1000);

      newMediaRecorder.onstop = () => {
        clearInterval(recordingInterval);
        if (sendRecord) {
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          sendMessage({ type: "audio", content: "", audio: audioBlob });
        }
        audioChunks = [];
        stream.getAudioTracks().forEach((track) => track.stop());
      };

      setMediaRecorder(newMediaRecorder);
    } catch (ex) {
      console.log(ex);
    }
  };

  const stopRecording = (send: boolean) => {
    sendRecord = send;
    mediaRecorder?.stop();
    onEnd();
  };

  useEffect(() => {
    startRecording();
  }, []);

  return (
    <>
      {mediaRecorder && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={3}
          width="100%"
        >
          <IconButton
            children={<TbTrash />}
            size="small"
            color="primary"
            onClick={() => {
              stopRecording(false);
            }}
          />
          <LiveAudioVisualizer
            mediaRecorder={mediaRecorder}
            barColor="#3458FC"
          />
          <Typography>{recorded}</Typography>
          <IconButton
            children={<BsSendFill />}
            size="small"
            color="primary"
            onClick={() => {
              stopRecording(true);
            }}
          />
        </Stack>
      )}
    </>
  );
};

export default AudioRecordInput;
