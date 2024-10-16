import { Button, CircularProgress } from "@mui/material";
import useAcceptFriendRequest from "../hooks/useAcceptFriendRequest";
import { IUserSnapshot } from "../hooks/useFriends";
import useRefuseFriendRequest from "../hooks/useRefuseFriendRequest";
import UserCard from "./UserCard";

interface Props {
  user: IUserSnapshot;
  requestId: string;
}

const FriendRequestCard = ({ requestId, user }: Props) => {
  const {
    refuseFriendRequest,
    isRefuseFriendRequestSuccess,
    isRefuseFriendRequestPending,
  } = useRefuseFriendRequest(requestId);

  const {
    acceptFriendRequest,
    isAcceptFriendRequestSuccess,
    isAcceptFriendRequestPending,
  } = useAcceptFriendRequest(requestId);

  return (
    <UserCard user={user}>
      {!isAcceptFriendRequestSuccess && !isRefuseFriendRequestSuccess ? (
        <>
          <Button
            variant="contained"
            onClick={acceptFriendRequest}
            disabled={
              isAcceptFriendRequestPending || isRefuseFriendRequestPending
            }
          >
            {isRefuseFriendRequestPending ? (
              <CircularProgress color="inherit" size={24} />
            ) : (
              "Confirm"
            )}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={refuseFriendRequest}
            disabled={
              isAcceptFriendRequestPending || isRefuseFriendRequestPending
            }
          >
            {isRefuseFriendRequestPending ? (
              <CircularProgress color="inherit" size={24} />
            ) : (
              "Delete"
            )}
          </Button>
        </>
      ) : (
        <Button disabled variant="contained">
          {isAcceptFriendRequestSuccess
            ? "Request Accepted"
            : "Request Refused"}
        </Button>
      )}
    </UserCard>
  );
};

export default FriendRequestCard;
