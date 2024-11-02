import useNewFriends from "../hooks/useNewFriends";
import NewFriendCard from "./NewFriendCard";
import GridDisplayer from "./GridDisplayer";
import UserCardSkeleton from "./Skeletons/UserCardSkeleton";

const NewFriendsList = () => {
  const { newFriends, isGetNewFriendsPending } = useNewFriends();
  return (
    <GridDisplayer>
      {isGetNewFriendsPending &&
        [1, 2, 3].map((id) => <UserCardSkeleton key={id} />)}
      {newFriends &&
        newFriends.map((friend) => (
          <NewFriendCard user={friend} key={friend._id} />
        ))}
    </GridDisplayer>
  );
};

export default NewFriendsList;
