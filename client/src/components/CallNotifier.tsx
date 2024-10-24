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
import { IoVideocam } from "react-icons/io5";

const CallNotifier = () => {
  const socket = useSocketContext();
  const [{ conversation, type }, setCall] = useState<{
    conversation: IConversation | null;
    type: string | null;
  }>({ conversation: null, type: null });
  const navigate = useNavigate();

  useEffect(() => {
    socket?.on("newCall", (conversation, type) => {
      setCall({ conversation, type });
    });
  }, [socket]);

  const acceptOffer = () => {
    if (!conversation) return;
    const route = `/call/${conversation._id}?callType=${type}`;
    setCall({ conversation: null, type: null });
    navigate(route);
  };

  if (!conversation) return <></>;

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
          <Avatar src={getConversationPicture(conversation)} />
          <Stack>
            <Typography>{getConversationName(conversation)}</Typography>
            <Typography variant="caption">Received Call</Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <IconButton
              sx={{ backgroundColor: "#FF4E46", color: "white" }}
              onClick={() => {
                setCall({ conversation: null, type: null });
              }}
            >
              <MdCallEnd />
            </IconButton>
            <IconButton
              sx={{ backgroundColor: "#3BCF60", color: "white" }}
              onClick={acceptOffer}
            >
              {type === "video" ? <IoVideocam /> : <MdCall />}
            </IconButton>
          </Stack>
        </Stack>
      </Box>
    </Snackbar>
  );
};

export default CallNotifier;
