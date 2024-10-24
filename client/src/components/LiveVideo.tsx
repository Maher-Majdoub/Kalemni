import { useEffect, useRef } from "react";

const LiveVideo = ({
  stream,
  muted,
}: {
  stream: MediaStream;
  muted: boolean;
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current && videoRef.current) {
      videoRef.current.srcObject = stream;
      audioRef.current.srcObject = stream;
    }
  }, [audioRef, videoRef]);

  return (
    <>
      <video autoPlay ref={videoRef} muted />
      <audio autoPlay ref={audioRef} muted={muted} />
    </>
  );
};

export default LiveVideo;
