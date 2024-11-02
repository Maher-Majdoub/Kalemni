import {
  Dialog,
  Stack,
  Box,
  IconButton,
  Typography,
  Avatar,
  ButtonBase,
  Button,
  CircularProgress,
} from "@mui/material";
import { CgClose } from "react-icons/cg";
import useAddUsersToConversation from "../hooks/useAddUsersToConversation";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useFriends, { IUserSnapshot } from "../hooks/useFriends";
import useConversation from "../hooks/useConversation";
import RemoveBadge from "./RemoveBadge";

interface Props {
  showDialog: boolean;
  onClose(): void;
}

const AddUsersToConversationDialog = ({ showDialog, onClose }: Props) => {
  const { conversationId } = useParams();
  const {
    addUsersToConversation,
    isAddUsersToConversationPending,
    isAddUsersToConversationSuccess,
  } = useAddUsersToConversation(conversationId as string);
  const { conversation } = useConversation(conversationId as string);
  const { friends } = useFriends();
  const [selectedFriends, setSelectedFriends] = useState<IUserSnapshot[]>([]);
  const [restFriends, setRestFriends] = useState<IUserSnapshot[]>([]);

  const removeSelectedFriend = (friendId: string) => {
    setSelectedFriends(
      selectedFriends.filter((friend) => friend._id !== friendId)
    );
  };

  useEffect(() => {
    if (!conversation) return;
    const newRestFriends: IUserSnapshot[] = [];
    if (friends)
      friends.map((friend) => {
        const inConversation = conversation.participants.find(
          (participant) => participant.user._id === friend._id
        );
        if (selectedFriends.indexOf(friend) === -1 && !inConversation)
          newRestFriends.push(friend);
      });
    setRestFriends(newRestFriends);
  }, [friends, selectedFriends, conversation]);

  useEffect(() => {
    if (isAddUsersToConversationSuccess) onClose();
  }, [isAddUsersToConversationSuccess]);

  return (
    <Dialog open={showDialog}>
      <Stack width="max(50%; 300px)" maxHeight="50vh">
        <Box textAlign="end">
          <IconButton children={<CgClose />} onClick={onClose} />
        </Box>
        <Stack
          padding="0 20px 20px"
          spacing={2}
          textAlign="center"
          flex={1}
          minHeight={0}
        >
          <Typography variant="h6">Add Friends To Group Chat</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography>Selected : </Typography>
            <Stack
              direction="row"
              spacing={2}
              padding={"10px 0 0"}
              flex={1}
              minWidth={0}
              overflow="auto"
            >
              {selectedFriends.map((friend) => (
                <RemoveBadge
                  key={friend._id}
                  onRemove={() => {
                    removeSelectedFriend(friend._id);
                  }}
                >
                  <Avatar src={friend.profilePicture} />
                </RemoveBadge>
              ))}
            </Stack>
          </Stack>
          <Stack overflow="auto">
            {restFriends.map((friend) => (
              <ButtonBase
                key={friend._id}
                onClick={() => {
                  setSelectedFriends([...selectedFriends, friend]);
                }}
              >
                <Stack
                  direction="row"
                  width="100%"
                  spacing={2}
                  padding={1}
                  alignItems="center"
                >
                  <Avatar src={friend.profilePicture} />
                  <Typography>
                    {friend.firstName} {friend.lastName}
                  </Typography>
                </Stack>
              </ButtonBase>
            ))}
          </Stack>
          <Button
            variant="contained"
            disabled={
              isAddUsersToConversationPending || selectedFriends.length === 0
            }
            onClick={() => {
              addUsersToConversation({
                users: selectedFriends.map((friend) => friend._id),
              });
            }}
          >
            {isAddUsersToConversationPending ? (
              <CircularProgress size={25} />
            ) : (
              "Add Users"
            )}
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default AddUsersToConversationDialog;
