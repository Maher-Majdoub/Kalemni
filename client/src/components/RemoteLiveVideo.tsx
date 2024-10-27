import { useEffect, useRef } from "react";
import { IPeer } from "../hooks/useJoinCall";
import { Avatar, Box } from "@mui/material";

interface Props {
  peer: IPeer;
  muted: boolean;
}

const RemoteLiveVideo = ({ peer, muted }: Props) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current && videoRef.current) {
      videoRef.current.srcObject = peer.stream;
      audioRef.current.srcObject = peer.stream;
    }
  }, [audioRef, videoRef]);

  return (
    <Box position="relative" height="100%" width="100%">
      <video autoPlay ref={videoRef} muted />
      <audio autoPlay ref={audioRef} muted={muted} />
      <Box
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        zIndex={peer.videoEnabled ? -1 : 2}
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          background:
            "radial-gradient(circle at 50% 50%, rgb(65 65 65), rgb(142 142 142))",
          backdropFilter: "blur(10px)",
        }}
      >
        <Avatar
          src={peer.user.profilePicture}
          sx={{ width: 100, height: 100 }}
        />
      </Box>
    </Box>
  );
};

export default RemoteLiveVideo;
