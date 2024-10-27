import {
  Box,
  IconButton,
  Stack,
  Avatar,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import { FaArrowLeft } from "react-icons/fa6";
import { useWindowTypeContext } from "../providers/WindowTypeProvider";
import {
  getConversationPicture,
  getConversationName,
} from "../services/conversationServices";
import OnlineBadge from "./OnlineBadge";
import useConversation from "../hooks/useConversation";
import { useNavigate, useParams } from "react-router-dom";
import { IoCall, IoVideocam } from "react-icons/io5";

interface Props {
  onClose(): void;
}

const ConversationDetailsHeader = ({ onClose = () => {} }: Props) => {
  const { conversationId } = useParams();
  const { conversation } = useConversation(conversationId as string);
  const { isLaptop } = useWindowTypeContext();
  const navigate = useNavigate();

  if (!conversation) return <p>wait...</p>;

  return (
    <>
      {isLaptop && (
        <Box position="absolute" top={15} left={15}>
          <IconButton onClick={onClose} color="primary">
            <FaArrowLeft />
          </IconButton>
        </Box>
      )}
      <Box>
        <Stack
          padding="30px 5px"
          spacing={2}
          alignItems="center"
          justifyContent="center"
        >
          <OnlineBadge isConnected>
            <Avatar
              src={getConversationPicture(conversation)}
              sx={{ width: 60, height: 60 }}
            />
          </OnlineBadge>
          <Box textAlign="center">
            <Typography>{getConversationName(conversation)}</Typography>
            <Typography variant="caption" color="gray">
              {conversation.type === "p" ? "private" : "group"} chat
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button
              size="small"
              startIcon={<IoCall />}
              onClick={() => {
                navigate(`/call/${conversation._id}?callType=audio`);
              }}
            >
              Audio Call
            </Button>
            <Button
              size="small"
              startIcon={<IoVideocam />}
              onClick={() => {
                navigate(`/call/${conversation._id}?callType=video`);
              }}
            >
              Video Call
            </Button>
          </Stack>
        </Stack>
        <Divider />
      </Box>
    </>
  );
};

export default ConversationDetailsHeader;
