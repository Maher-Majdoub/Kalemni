import {
  Box,
  IconButton,
  Stack,
  Avatar,
  Typography,
  Divider,
} from "@mui/material";
import { FaArrowLeft } from "react-icons/fa6";
import { useWindowTypeContext } from "../providers/WindowTypeProvider";
import {
  getConversationPicture,
  getConversationName,
} from "../services/conversationServices";
import OnlineBadge from "./OnlineBadge";
import useConversation from "../hooks/useConversation";
import { useParams } from "react-router-dom";

interface Props {
  onClose(): void;
}

const ConversationDetailsHeader = ({ onClose = () => {} }: Props) => {
  const { conversationId } = useParams();
  const { conversation } = useConversation(conversationId as string);
  const { isLaptop } = useWindowTypeContext();

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
          padding={7}
          spacing={1}
          alignItems="center"
          justifyContent="center"
        >
          <Stack alignItems="center">
            <Box>
              <OnlineBadge isConnected>
                <Avatar
                  src={getConversationPicture(conversation)}
                  sx={{ width: 60, height: 60 }}
                />
              </OnlineBadge>
            </Box>
          </Stack>
          <Box textAlign="center">
            <Typography>{getConversationName(conversation)}</Typography>
            <Typography variant="caption" color="gray">
              {conversation.type === "p" ? "private" : "group"} chat
            </Typography>
          </Box>
        </Stack>
        <Divider />
      </Box>
    </>
  );
};

export default ConversationDetailsHeader;
