import {
  Button,
  Card,
  CircularProgress,
  Grid2,
  Stack,
  Typography,
} from "@mui/material";
import useFriendRequests from "../hooks/useFriendRequests";
import useRefuseFriendRequest from "../hooks/useRefuseFriendRequest";
import { IUserSnapshot } from "../hooks/useFriends";
import useAcceptFriendRequest from "../hooks/useAcceptFriendRequest";

interface Props {
  user: IUserSnapshot;
  requestId: string;
}

const UserCard = ({ user, requestId }: Props) => {
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
    <Card>
      <Stack>
        <img src={user.profilePicture} width={200} />
        <Stack spacing={1} padding={2}>
          <Typography variant="h6">
            {user.firstName} {user.lastName}
          </Typography>
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
        </Stack>
      </Stack>
    </Card>
  );
};

const FriendRequestsList = () => {
  const { friendRequests } = useFriendRequests();

  return (
    <Grid2 container spacing={2}>
      {friendRequests?.map((friendRequest) => (
        <Grid2 key={friendRequest._id}>
          <UserCard user={friendRequest.user} requestId={friendRequest._id} />
        </Grid2>
      ))}
    </Grid2>
  );
};

export default FriendRequestsList;
