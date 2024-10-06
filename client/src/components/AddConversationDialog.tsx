import {
  Avatar,
  Button,
  CircularProgress,
  Dialog,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import useFriends, { IUserSnapshot } from "../hooks/useFriends";
import useCreateConversation from "../hooks/useCreateGroupConversation";
import { useForm } from "react-hook-form";

interface Props {
  open: boolean;
  onClose(): void;
}

const AddConversationDialog = ({ open, onClose }: Props) => {
  const { friends } = useFriends();
  const [selectedFriends, setSelectedFriends] = useState<IUserSnapshot[]>([]);
  const [restFriends, setRestFriends] = useState<IUserSnapshot[]>([]);
  const { register, handleSubmit } = useForm();
  const { createConversation, isCreateConversationPending } =
    useCreateConversation();

  useEffect(() => {
    const newRestFriends: IUserSnapshot[] = [];
    if (friends)
      friends.map((friend) => {
        if (selectedFriends.indexOf(friend) === -1) newRestFriends.push(friend);
      });
    setRestFriends(newRestFriends);
  }, [friends, selectedFriends]);

  if (!friends) return <p>Wait ...</p>;

  return (
    <Dialog open={open}>
      <Button onClick={onClose}>X</Button>
      <Stack padding={3} spacing={2}>
        <Typography variant="h4">Create New Chat Group</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography>Selected : </Typography>
          <Stack direction="row" spacing={1}>
            {selectedFriends.map((friend) => (
              <Avatar src={friend.profilePicture} key={friend._id} />
            ))}
          </Stack>
        </Stack>
        {restFriends.map((friend) => (
          <Button
            key={friend._id}
            onClick={() => {
              setSelectedFriends([...selectedFriends, friend]);
            }}
          >
            {friend.firstName}
          </Button>
        ))}
        <TextField
          {...register("conversationName")}
          label="Group Name"
          fullWidth
          size="small"
        />
        <Button
          variant="contained"
          disabled={isCreateConversationPending}
          onClick={handleSubmit((data) => {
            createConversation({
              conversationName: data.conversationName,
              participants: selectedFriends.map((friend) => friend._id),
            });
          })}
        >
          {isCreateConversationPending ? <CircularProgress /> : "Create Group"}
        </Button>
      </Stack>
    </Dialog>
  );
};

export default AddConversationDialog;
