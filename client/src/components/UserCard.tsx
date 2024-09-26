import {
  Button,
  Card,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { UserSnapshotData } from "../hooks/useFriends";
import defaultUserIcon from "../assets/default_user_icon.png";
import useSendFriendRequest from "../hooks/useSendFriendRequest";

const UserCard = ({ user }: { user: UserSnapshotData }) => {
  const {
    sendFriendRequest,
    isSendFriendRequestSuccess,
    isSendFriendRequestPending,
  } = useSendFriendRequest(user._id);

  if (isSendFriendRequestSuccess) console.log("done");

  return (
    <Card>
      <Stack>
        <img src={user.profilePicture || defaultUserIcon} width={200} />
        <Stack spacing={1} padding={2}>
          <Typography variant="h6">
            {user.firstName} {user.lastName}
          </Typography>
          {!isSendFriendRequestSuccess ? (
            <Button variant="contained" onClick={() => sendFriendRequest({})}>
              {isSendFriendRequestPending ? (
                <CircularProgress color="inherit" size={24} />
              ) : (
                "Add Friend"
              )}
            </Button>
          ) : (
            <Button disabled variant="contained">
              Request Sent
            </Button>
          )}
        </Stack>
      </Stack>
    </Card>
  );
};

export default UserCard;
