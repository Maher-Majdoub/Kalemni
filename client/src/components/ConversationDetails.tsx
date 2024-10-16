import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { IConversation } from "../hooks/useConversation";
import {
  getConversationName,
  getConversationPicture,
} from "../services/conversationServices";
import OnlineBadge from "./OnlineBadge";
import useSharedMedia from "../hooks/useSharedMedia";
import { FaArrowLeft } from "react-icons/fa6";
import { useWindowTypeContext } from "../providers/WindowTypeProvider";
import { BASE_URL } from "../services/apiClient";

interface Props {
  conversation: IConversation;
  onClose?(): void;
}

const ConversationDetails = ({ conversation, onClose = () => {} }: Props) => {
  const { sharedMedia } = useSharedMedia(conversation._id);

  const { isLaptop } = useWindowTypeContext();

  return (
    <Box
      borderLeft="1px solid #eee"
      maxWidth={isLaptop ? "min(80vw, 400px)" : "300px"}
      flex={1}
      position="relative"
      minWidth="300px"
    >
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
        </Stack>
        <Divider />
      </Box>
      <Stack padding={1.5} spacing={2}>
        {conversation.type === "g" && (
          <Stack spacing={1}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography fontWeight="600" fontSize={17}>
                {conversation.participants.length} Particpants
              </Typography>
              <Button>See all</Button>
            </Stack>
            <Stack spacing={1.5}>
              {conversation.participants.slice(0, 3).map((participant) => (
                <Stack
                  key={participant.user._id}
                  direction="row"
                  spacing={1}
                  alignItems={"center"}
                >
                  <Avatar
                    src={participant.user.profilePicture}
                    sx={{ width: 30, height: 30 }}
                  />

                  <Typography>
                    {participant.user.firstName} {participant.user.lastName}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        )}
        <Stack spacing={1}>
          <Typography fontWeight="600" fontSize={17}>
            Shared Media
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
              gap: 0.5,
            }}
          >
            {sharedMedia?.map((media) => (
              <Box key={media._id} width="100%">
                {media.type === "image" && (
                  <img width="100%" src={`${BASE_URL}${media.src}`} />
                )}
                {media.type === "video" && (
                  <video
                    width="100%"
                    src={`${BASE_URL}${media.src}`}
                    controls
                  />
                )}
              </Box>
            ))}
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ConversationDetails;
