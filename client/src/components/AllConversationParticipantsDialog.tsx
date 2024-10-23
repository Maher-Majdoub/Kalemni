import {
  Dialog,
  Stack,
  Box,
  IconButton,
  Typography,
  Avatar,
} from "@mui/material";
import { CgClose } from "react-icons/cg";
import { useParams } from "react-router-dom";
import useConversation from "../hooks/useConversation";

interface Props {
  showDialog: boolean;
  onClose(): void;
}

const AllConversationParticipantsDialog = ({ showDialog, onClose }: Props) => {
  const { conversationId } = useParams();

  const { conversation } = useConversation(conversationId as string);

  if (!conversation) return <p>wait....</p>;

  return (
    <Dialog open={showDialog}>
      <Stack maxHeight="50vh">
        <Box textAlign="end">
          <IconButton children={<CgClose />} onClick={onClose} />
        </Box>
        <Typography padding={2}>All Participants:</Typography>
        <Box flex={1} minHeight={0} overflow="auto">
          {conversation.participants.map((participant) => (
            <Stack
              key={participant.user._id}
              direction="row"
              alignItems="center"
              spacing={2}
              padding="5px 20px"
              marginBottom={1}
            >
              <Avatar src={participant.user.profilePicture} />
              <Stack>
                <Typography>
                  {participant.user.firstName} {participant.user.lastName}
                </Typography>
                {participant.user.bio && (
                  <Typography variant="caption" color="gray">
                    {participant.user.bio}
                  </Typography>
                )}
              </Stack>
            </Stack>
          ))}
        </Box>
      </Stack>
    </Dialog>
  );
};

export default AllConversationParticipantsDialog;
