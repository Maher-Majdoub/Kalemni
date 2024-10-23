import useFriendRequests from "../hooks/useFriendRequests";
import FriendRequestCard from "./FriendRequestCard";
import GridDisplayer from "./GridDisplayer";

const FriendRequestsList = () => {
  const { friendRequests } = useFriendRequests();

  return (
    <GridDisplayer>
      {friendRequests?.map((friendRequest) => (
        <FriendRequestCard
          key={friendRequest._id}
          user={friendRequest.user}
          requestId={friendRequest._id}
        />
      ))}
    </GridDisplayer>
  );
};

export default FriendRequestsList;
