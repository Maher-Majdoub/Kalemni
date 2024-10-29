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
import RemoteLiveVideo from "./RemoteLiveVideo";
import { useWindowTypeContext } from "../providers/WindowTypeProvider";
import useJoinCall, { IPeer } from "../hooks/useJoinCall";
import LocalLiveVideo from "./LocalLiveVideo";
import { toast } from "react-toastify";

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
  const [availablePeers, setAvailablePeers] = useState<IPeer[]>([]);

  const { joinCall, toggleEnableVideo, toggleEnableAudio, cleanup } =
    useJoinCall({
      conversationId,
      callType,
      localStreamRef,
      localVideoRef,
      onUpdateRemoteMedias: (peers) => {
        const newPeers: IPeer[] = [];
        peers.forEach((peer) => {
          if (peer.stream) newPeers.push(peer);
        });
        setAvailablePeers(newPeers);
      },
      onFullCall: () => {
        toast.info("The Call Is Full");
        navigate("/");
      },
    });

  useEffect(() => {
    if (socket) joinCall(socket);
  }, [socket]);

  useEffect(() => {
    const streamsCount = availablePeers.length;
    if (streamsCount === 1) setGridTemplate("100% / 100%");

    if (streamsCount === 2)
      setGridTemplate(isLaptop ? "50% 50% / 100%" : "100% / 50% 50%");

    if (streamsCount === 3)
      setGridTemplate(isLaptop ? "33% 33% 34% / 100%" : "100% / 33% 33% 34%");
  }, [availablePeers, isLaptop]);

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
          {availablePeers.map((peer, index) => (
            <Box key={index} textAlign="center">
              <RemoteLiveVideo peer={peer} muted={mute} />
            </Box>
          ))}
        </Box>
        <LocalLiveVideo localVideoRef={localVideoRef} isEnabled={enableVideo} />
        <Stack
          direction="row"
          borderRadius={10}
          padding="10px 20px"
          spacing={3}
          position="absolute"
          bottom={30}
          left="50%"
          zIndex={999}
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
              cleanup(socket);
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
