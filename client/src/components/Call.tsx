import { useEffect, useRef, useState } from "react";
import { useSocketContext } from "../providers/SocketProvider";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Box, Stack, IconButton } from "@mui/material";
import { IoMdVolumeOff, IoMdVolumeHigh } from "react-icons/io";
import {
  IoVideocam,
  IoVideocamOff,
  IoMicSharp,
  IoMicOffSharp,
} from "react-icons/io5";
import { MdCallEnd } from "react-icons/md";
import LiveVideo from "./LiveVideo";
import { useWindowTypeContext } from "../providers/WindowTypeProvider";
import useJoinCall from "../hooks/useJoinCall";

const Call = () => {
  const { conversationId } = useParams();
  const [searchParams] = useSearchParams();
  const callType = searchParams.get("callType");
  const [mute, setMute] = useState(false);
  const [enableAudio, setEnableAudio] = useState(true);
  const [enableVideo, setEnableVideo] = useState(callType === "video");
  const [gridTemplate, setGridTemplate] = useState("");
  const { isLaptop } = useWindowTypeContext();
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const socket = useSocketContext();
  const navigate = useNavigate();
  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);

  const { joinCall, toggleEnableVideo, toggleEnableAudio, cleanup } =
    useJoinCall({
      conversationId,
      callType,
      localStreamRef,
      localVideoRef,
      onUpdateRemoteMedias: (peers) => {
        const newStreams: MediaStream[] = [];
        peers.forEach((peer) => {
          if (peer.stream) newStreams.push(peer.stream);
        });
        setRemoteStreams(newStreams);
      },
    });

  useEffect(() => {
    if (socket) joinCall(socket);
  }, [socket]);

  useEffect(() => {
    const streamsCount = remoteStreams.length;
    if (streamsCount === 1) setGridTemplate("100% / 100%");

    if (streamsCount === 2)
      setGridTemplate(isLaptop ? "50% 50% / 100%" : "100% / 50% 50%");

    if (streamsCount === 3)
      setGridTemplate(isLaptop ? "33% 33% 34% / 100%" : "100% / 33% 33% 34%");
  }, [remoteStreams, isLaptop]);

  useEffect(() => {
    return cleanup(socket);
  }, []);

  if (!socket) return <p>wait...</p>;

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "white",
        zIndex: 999,
      }}
    >
      <Box position="relative" width="100%" height="100%">
        <Box
          height="100%"
          width="100%"
          sx={{
            display: "grid",
            gridTemplate: gridTemplate,
          }}
        >
          {remoteStreams.map((stream, index) => (
            <Box key={index} textAlign="center">
              <LiveVideo stream={stream} muted={mute} />
            </Box>
          ))}
        </Box>
        <Box
          position="absolute"
          top={10}
          right={10}
          width="100px"
          height="180px"
          borderRadius={3}
          overflow="hidden"
        >
          <video ref={localVideoRef} autoPlay muted width="100%" />
        </Box>
        <Stack
          direction="row"
          borderRadius={10}
          padding="10px 20px"
          spacing={3}
          position="absolute"
          bottom={30}
          left="50%"
          color="white"
          sx={{ transform: "translate(-50%, 0)", backgroundColor: "#272727eb" }}
        >
          <IconButton
            sx={{ color: "white" }}
            onClick={() => {
              toggleEnableVideo({ socket, enableVideo });
              setEnableVideo(!enableVideo);
            }}
          >
            {enableVideo ? <IoVideocam /> : <IoVideocamOff />}
          </IconButton>
          <IconButton
            sx={{ color: "white" }}
            onClick={() => {
              toggleEnableAudio({ socket, enableAudio });
              setEnableAudio(!enableAudio);
            }}
          >
            {enableAudio ? <IoMicSharp /> : <IoMicOffSharp />}
          </IconButton>
          <IconButton sx={{ color: "white" }} onClick={() => setMute(!mute)}>
            {mute ? <IoMdVolumeOff /> : <IoMdVolumeHigh />}
          </IconButton>
          <IconButton
            sx={{ backgroundColor: "#FF4E46", color: "white" }}
            onClick={() => {
              navigate("/");
            }}
          >
            <MdCallEnd />
          </IconButton>
        </Stack>
      </Box>
    </Box>
  );
};

export default Call;
