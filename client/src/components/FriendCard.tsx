import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import { IUserSnapshot } from "../hooks/useFriends";
import {
  Button,
  CircularProgress,
  Dialog,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useConversations from "../hooks/useConversations";
import useDeleteFriend from "../hooks/useDeleteUser";

interface Props {
  friend: IUserSnapshot;
}

const FriendCard = ({ friend }: Props) => {
  const { conversations } = useConversations();
  const { deleteFriend, isDeleteFriendSuccess, isDeleteFriendPending } =
    useDeleteFriend(friend._id);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const navigate = useNavigate();

  const navigateToPrivateChat = (userId: string) => {
    if (!conversations) return;
    for (const conversation of conversations) {
      if (
        conversation.type === "p" &&
        conversation.participants[0].user._id === userId
      ) {
        return navigate(`/conversations/${conversation._id}`);
      }
    }
  };

  useEffect(() => {
    if (isDeleteFriendSuccess) setShowDeleteDialog(false);
  }, [isDeleteFriendSuccess]);

  return (
    <UserCard user={friend}>
      <Button
        variant="contained"
        onClick={() => {
          navigateToPrivateChat(friend._id);
        }}
      >
        Send Message
      </Button>
      <Button
        color="error"
        variant="contained"
        onClick={() => {
          setShowDeleteDialog(true);
        }}
      >
        Delete From List
      </Button>
      <Dialog open={showDeleteDialog}>
        <Stack spacing={2} padding={2}>
          <Typography>
            Are you sure want to delete this user from your friends list?
          </Typography>
          <Stack direction="row" justifyContent="end" spacing={1}>
            <Button
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleteFriendPending}
            >
              Cancel
            </Button>
            <Button
              color="error"
              onClick={deleteFriend}
              disabled={isDeleteFriendPending}
            >
              {isDeleteFriendPending ? (
                <CircularProgress size={25} />
              ) : (
                "Delete"
              )}
            </Button>
          </Stack>
        </Stack>
      </Dialog>
    </UserCard>
  );
};

export default FriendCard;
