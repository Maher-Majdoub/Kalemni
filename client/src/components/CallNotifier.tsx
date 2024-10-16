import {
  Avatar,
  Box,
  IconButton,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { MdCallEnd, MdCall } from "react-icons/md";
import { useSocketContext } from "../providers/SocketProvider";
import { IConversation } from "../hooks/useConversation";
import { useNavigate } from "react-router-dom";
import {
  getConversationName,
  getConversationPicture,
} from "../services/conversationServices";

const CallNotifier = () => {
  const socket = useSocketContext();
  const [call, setCall] = useState<IConversation | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    socket?.on("new-call", ({ conversation }) => setCall(conversation));
  }, [socket]);

  const acceptOffer = () => {
    if (!call) return;
    const route = `/call/${call._id}`;
    setCall(null);
    navigate(route);
  };

  if (!call) return <></>;

  return (
    <Snackbar open anchorOrigin={{ vertical: "top", horizontal: "center" }}>
      <Box>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          padding={2}
          borderRadius={4}
          color="white"
          sx={{ backgroundColor: "#696969" }}
        >
          <Avatar src={getConversationPicture(call)} />
          <Stack>
            <Typography>{getConversationName(call)}</Typography>
            <Typography variant="caption">Received Call</Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <IconButton
              sx={{ backgroundColor: "#FF4E46", color: "white" }}
              onClick={() => {
                setCall(null);
              }}
            >
              <MdCallEnd />
            </IconButton>
            <IconButton
              sx={{ backgroundColor: "#3BCF60", color: "white" }}
              onClick={acceptOffer}
            >
              <MdCall />
            </IconButton>
          </Stack>
        </Stack>
      </Box>
    </Snackbar>
  );
};

export default CallNotifier;
