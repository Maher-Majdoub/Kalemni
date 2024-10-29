import useFriends from "../hooks/useFriends";
import GridDisplayer from "./GridDisplayer";
import FriendCard from "./FriendCard";
import UserCardSkeleton from "./Skeletons/UserCardSkeleton";

const FriendsList = () => {
  const { friends, isGetFriendsPending } = useFriends();

  return (
    <GridDisplayer>
      {isGetFriendsPending &&
        [1, 2, 3].map((id) => <UserCardSkeleton key={id} />)}
      {friends &&
        friends.map((friend) => (
          <FriendCard friend={friend} key={friend._id} />
        ))}
    </GridDisplayer>
  );
};

export default FriendsList;
