import useFriendRequests from "../hooks/useFriendRequests";
import FriendRequestCard from "./FriendRequestCard";
import GridDisplayer from "./GridDisplayer";
import UserCardSkeleton from "./Skeletons/UserCardSkeleton";

const FriendRequestsList = () => {
  const { friendRequests, isGetFriendRequestsPending } = useFriendRequests();

  return (
    <GridDisplayer>
      {isGetFriendRequestsPending &&
        [1, 2, 3].map((id) => <UserCardSkeleton key={id} />)}
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
