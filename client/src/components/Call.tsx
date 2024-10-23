import { useEffect, useRef, useState } from "react";
import { useSocketContext } from "../providers/SocketProvider";
import { Box, IconButton, Stack } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Peer from "simple-peer";
import { MdCallEnd } from "react-icons/md";
import { IoMdVolumeHigh, IoMdVolumeOff } from "react-icons/io";
import {
  IoMicOffSharp,
  IoMicSharp,
  IoVideocam,
  IoVideocamOff,
} from "react-icons/io5";
import { useWindowTypeContext } from "../providers/WindowTypeProvider";

interface IPeerRef {
  peerId: string;
  peer: Peer.Instance;
}
const Video = ({ peer, muted }: { peer: Peer.Instance; muted: boolean }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handleStream = (stream: MediaStream) => {
      if (videoRef.current) videoRef.current.srcObject = stream;
      if (audioRef.current) audioRef.current.srcObject = stream;
    };
    peer.on("stream", handleStream);

    return () => {
      peer.off("stream", handleStream);
    };
  }, [peer]);

  return (
    <>
      <video autoPlay ref={videoRef} muted />
      <audio autoPlay ref={audioRef} muted={muted} />
    </>
  );
};

const Call = () => {
  const { conversationId } = useParams();
  const socket = useSocketContext();
  const navigate = useNavigate();
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  const [peers, setPeers] = useState<Peer.Instance[]>([]);
  const peersRef = useRef<IPeerRef[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const [mute, setMute] = useState(false);
  const [enableAudio, setEnableAudio] = useState(true);
  const [enableVideo, setEnableVideo] = useState(true);
  const [gridTemplate, setGridTemplate] = useState("");

  const createPeer = (userToSignal: string, stream: MediaStream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
      config: {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      },
    });

    peer.on("signal", (signal) => {
      socket?.emit("sending-signal", {
        userToSignal,
        signal,
      });
    });

    return peer;
  };

  const addPeer = (
    incomingSignal: Peer.SignalData,
    callerID: string,
    stream: MediaStream
  ) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
      config: {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      },
    });

    peer.on("signal", (signal) => {
      socket?.emit("returning-signal", { signal, callerID });
    });
    peer.signal(incomingSignal);
    return peer;
  };

  const leaveCall = () => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    socket?.emit("leave", { conversationId });
  };

  const prepare = async () => {
    if (!socket) return;
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    mediaStreamRef.current = stream;

    if (localVideoRef.current) localVideoRef.current.srcObject = stream;

    socket.emit("join-room", { conversationId: conversationId });

    socket.on("all-users", (users) => {
      if (users.length === 0) {
        // this user started the call
        socket.emit("start-call", { conversationId });
      }

      peersRef.current = [];
      const peers: Peer.Instance[] = [];
      users.forEach((userID: string) => {
        const peer = createPeer(userID, stream);
        peersRef.current.push({
          peerId: userID,
          peer,
        });
        peers.push(peer);
      });
      setPeers(peers);
    });

    socket.on("user-joined", (payload) => {
      const peer = addPeer(payload.signal, payload.callerID, stream);

      const oldPeer = peersRef.current.find(
        (peer) => peer.peerId === payload.callerID
      );

      if (oldPeer) {
        oldPeer.peer = peer;
      } else
        peersRef.current.push({
          peerId: payload.callerID,
          peer,
        });

      setPeers(peersRef.current.map((peerRef) => peerRef.peer));
    });

    socket.on("receiving-returned-signal", (payload) => {
      const item = peersRef.current.find((p) => p.peerId === payload.id);
      if (item) item.peer.signal(payload.signal);
    });

    socket.on("user-leaved", ({ userId }) => {
      const newPeersRef = peersRef.current.filter(
        (peerRef) => peerRef.peerId !== userId
      );
      peersRef.current = newPeersRef;
      setPeers(newPeersRef.map((peerRef) => peerRef.peer));
    });
  };

  useEffect(() => {
    return leaveCall;
  }, []);

  useEffect(() => {
    if (!socket) return;
    prepare();
  }, [socket]);

  useEffect(() => {
    mediaStreamRef.current
      ?.getAudioTracks()
      .forEach((track) => (track.enabled = enableAudio));

    mediaStreamRef.current
      ?.getVideoTracks()
      .forEach((track) => (track.enabled = enableVideo));
  }, [enableAudio, enableVideo]);

  const { isLaptop } = useWindowTypeContext();

  useEffect(() => {
    if (peers.length === 1) setGridTemplate("100% / 100%");

    if (peers.length === 2)
      setGridTemplate(isLaptop ? "50% 50% / 100%" : "100% / 50% 50%");

    if (peers.length === 3)
      setGridTemplate(isLaptop ? "33% 33% 34% / 100%" : "100% / 33% 33% 34%");
  }, [peers, isLaptop]);

  if (!socket) return <p>Famech Socket bro</p>;

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
          {peers.map((peer, index) => (
            <Box key={index} textAlign="center">
              <Video peer={peer} muted={mute} />
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
            onClick={() => setEnableVideo(!enableVideo)}
          >
            {enableVideo ? <IoVideocam /> : <IoVideocamOff />}
          </IconButton>
          <IconButton
            sx={{ color: "white" }}
            onClick={() => setEnableAudio(!enableAudio)}
          >
            {enableAudio ? <IoMicSharp /> : <IoMicOffSharp />}
          </IconButton>
          <IconButton sx={{ color: "white" }} onClick={() => setMute(!mute)}>
            {mute ? <IoMdVolumeOff /> : <IoMdVolumeHigh />}
          </IconButton>
          <IconButton
            sx={{ backgroundColor: "#FF4E46", color: "white" }}
            onClick={() => {
              leaveCall();
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
