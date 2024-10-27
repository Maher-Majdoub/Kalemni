import {
  Stack,
  Tooltip,
  IconButton,
  Button,
  Dialog,
  Typography,
  CircularProgress,
} from "@mui/material";
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoEyeOutline } from "react-icons/io5";
import { RxExit } from "react-icons/rx";
import { useEffect, useState } from "react";
import AddUsersToConversationDialog from "./AddUsersToConversationDialog";
import AllConversationParticipantsDialog from "./AllConversationParticipantsDialog";
import useLeaveConversation from "../hooks/useLeaveConversation";
import { useNavigate, useParams } from "react-router-dom";

const ConversationTools = () => {
  const { conversationId } = useParams();
  const [showAllPaticipants, setShowAllParticipants] = useState(false);
  const [showAddFriends, setShowAddFriends] = useState(false);
  const [showLeaveConversationDialg, setShowLeaveConversationDialog] =
    useState(false);
  const navigate = useNavigate();
  const {
    leaveConversation,
    isLeaveConversationPending,
    isLeaveConversationSuccess,
  } = useLeaveConversation(conversationId as string);

  useEffect(() => {
    if (isLeaveConversationSuccess) {
      return navigate("/");
    }
  }, [isLeaveConversationSuccess]);

  return (
    <>
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
          <IconButton size="small" onClick={() => setShowAddFriends(true)}>
            <IoMdAddCircleOutline />
          </IconButton>
        </Tooltip>
        <Tooltip title="Leave Conversation">
          <IconButton
            size="small"
            onClick={() => setShowLeaveConversationDialog(true)}
          >
            <RxExit />
          </IconButton>
        </Tooltip>
      </Stack>
      <AllConversationParticipantsDialog
        showDialog={showAllPaticipants}
        onClose={() => setShowAllParticipants(false)}
      />
      <AddUsersToConversationDialog
        showDialog={showAddFriends}
        onClose={() => setShowAddFriends(false)}
      />
      <Dialog open={showLeaveConversationDialg}>
        <Stack spacing={2} padding={2}>
          <Typography>Are you sure want to leave this conversation</Typography>
          <Stack direction="row" justifyContent="end" spacing={1}>
            <Button onClick={() => setShowLeaveConversationDialog(false)}>
              Cancel
            </Button>
            <Button
              color="error"
              disabled={isLeaveConversationPending}
              onClick={() => {
                leaveConversation();
              }}
            >
              {isLeaveConversationPending ? (
                <CircularProgress size={25} />
              ) : (
                "Leave"
              )}
            </Button>
          </Stack>
        </Stack>
      </Dialog>
    </>
  );
};

export default ConversationTools;
