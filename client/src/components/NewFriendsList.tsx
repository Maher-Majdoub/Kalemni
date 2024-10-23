import useNewFriends from "../hooks/useNewFriends";
import NewFriendCard from "./NewFriendCard";
import GridDisplayer from "./GridDisplayer";

const NewFriendsList = () => {
  const { newFriends } = useNewFriends();
  return (
    <GridDisplayer>
      {newFriends?.map((friend) => (
        <NewFriendCard user={friend} key={friend._id} />
      ))}
    </GridDisplayer>
  );
};

export default NewFriendsList;
