import {
  Avatar,
  Box,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import useConversation from "../hooks/useConversation";
import { useWindowTypeContext } from "../providers/WindowTypeProvider";
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoEyeOutline } from "react-icons/io5";
import { useState } from "react";
import AddUsersToConversationDialog from "./AddUsersToConversationDialog";
import AllConversationParticipantsDialog from "./AllConversationParticipantsDialog";
import ConversationDetailsHeader from "./ConversationDetailsHeader";
import ConversationSharedMediaList from "./ConversationSharedMediaList";
import { useParams } from "react-router-dom";

interface Props {
  onClose?(): void;
}

const ConversationDetails = ({ onClose = () => {} }: Props) => {
  const { conversationId } = useParams();
  const { conversation } = useConversation(conversationId as string);
  const { isLaptop } = useWindowTypeContext();
  const [showAllPaticipants, setShowAllParticipants] = useState(false);
  const [showAddFriends, setShowAddFriends] = useState(false);

  if (!conversation) return <p>wait...</p>;

  return (
    <Box
      borderLeft="1px solid #eee"
      maxWidth={isLaptop ? "min(80vw, 400px)" : "300px"}
      flex={1}
      position="relative"
      minWidth="300px"
    >
      <ConversationDetailsHeader onClose={onClose} />
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
              <Stack direction="row">
                <Tooltip title="See All">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setShowAllParticipants(true);
                    }}
                  >
                    <IoEyeOutline />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Add Friend">
                  <IconButton
                    size="small"
                    onClick={() => setShowAddFriends(true)}
                  >
                    <IoMdAddCircleOutline />
                  </IconButton>
                </Tooltip>
              </Stack>
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
        <ConversationSharedMediaList />
      </Stack>
      <AllConversationParticipantsDialog
        showDialog={showAllPaticipants}
        onClose={() => setShowAllParticipants(false)}
      />
      <AddUsersToConversationDialog
        showDialog={showAddFriends}
        onClose={() => setShowAddFriends(false)}
      />
    </Box>
  );
};

export default ConversationDetails;
