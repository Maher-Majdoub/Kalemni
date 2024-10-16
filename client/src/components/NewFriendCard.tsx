import { Button, CircularProgress } from "@mui/material";
import { IUserSnapshot } from "../hooks/useFriends";
import useSendFriendRequest from "../hooks/useSendFriendRequest";
import UserCard from "./UserCard";

const NewFriendCard = ({ user }: { user: IUserSnapshot }) => {
  const {
    sendFriendRequest,
    isSendFriendRequestSuccess,
    isSendFriendRequestPending,
  } = useSendFriendRequest(user._id);

  return (
    <UserCard user={user}>
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
    </UserCard>
  );
};

export default NewFriendCard;
