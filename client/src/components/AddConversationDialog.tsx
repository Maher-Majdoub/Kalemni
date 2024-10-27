import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  CircularProgress,
  Dialog,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import useFriends, { IUserSnapshot } from "../hooks/useFriends";
import useCreateConversation from "../hooks/useCreateGroupConversation";
import { useForm } from "react-hook-form";
import { CgClose } from "react-icons/cg";
import RemoveBadge from "./RemoveBadge";

interface Props {
  open: boolean;
  onClose(): void;
}

const AddConversationDialog = ({ open, onClose }: Props) => {
  const { friends } = useFriends();
  const [selectedFriends, setSelectedFriends] = useState<IUserSnapshot[]>([]);
  const [restFriends, setRestFriends] = useState<IUserSnapshot[]>([]);
  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm();
  const {
    createConversation,
    isCreateConversationPending,
    isCreateConversationSuccess,
  } = useCreateConversation();

  const removeSelectedFriend = (friendId: string) => {
    setSelectedFriends(
      selectedFriends.filter((friend) => friend._id !== friendId)
    );
  };

  useEffect(() => {
    const newRestFriends: IUserSnapshot[] = [];
    if (friends)
      friends.map((friend) => {
        if (selectedFriends.indexOf(friend) === -1) newRestFriends.push(friend);
      });
    setRestFriends(newRestFriends);
  }, [friends, selectedFriends]);

  useEffect(() => {
    if (isCreateConversationSuccess) {
      setSelectedFriends([]);
      resetField("conversationName");
      onClose();
    }
  }, [isCreateConversationSuccess]);

  if (!friends) return <p>Wait ...</p>;

  return (
    <Dialog open={open} fullWidth>
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
          {friends.length === 0 ? (
            <Typography>You have no friends yet</Typography>
          ) : (
            <>
              <Typography variant="h6">Create New Group Chat</Typography>
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
              <TextField
                {...register("conversationName", {
                  required: { value: true, message: "Please enter group name" },
                })}
                error={!!errors.conversationName}
                helperText={errors.conversationName?.message?.toString()}
                label="Group Name"
                fullWidth
                size="small"
              />
              <Button
                variant="contained"
                disabled={
                  isCreateConversationPending || selectedFriends.length === 0
                }
                onClick={handleSubmit((data) => {
                  createConversation({
                    conversationName: data.conversationName,
                    participants: selectedFriends.map((friend) => friend._id),
                  });
                })}
              >
                {isCreateConversationPending ? (
                  <CircularProgress />
                ) : (
                  "Create Group"
                )}
              </Button>
            </>
          )}
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default AddConversationDialog;
