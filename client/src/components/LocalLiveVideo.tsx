import { Avatar, Box } from "@mui/material";
import useProfile from "../hooks/useProfile";

interface Props {
  localVideoRef: React.MutableRefObject<HTMLVideoElement | null>;
  isEnabled: boolean;
}

const LocalLiveVideo = ({ localVideoRef, isEnabled }: Props) => {
  const { profile } = useProfile();
  return (
    <Box
      position="absolute"
      top={10}
      right={10}
      width="100px"
      height="180px"
      borderRadius={3}
      overflow="hidden"
      zIndex={999}
    >
      <Box position="relative" width="100%" height="100%">
        <video ref={localVideoRef} autoPlay muted width="100%" />
        <Box
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          zIndex={isEnabled ? -1 : 2}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            background:
              "radial-gradient(circle at 50% 50%, rgb(65 65 65), rgb(142 142 142))",
            backdropFilter: "blur(10px)",
          }}
        >
          <Avatar src={profile?.profilePicture} />
        </Box>
      </Box>
    </Box>
  );
};

export default LocalLiveVideo;
