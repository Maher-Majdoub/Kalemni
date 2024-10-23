import useFriends from "../hooks/useFriends";
import GridDisplayer from "./GridDisplayer";
import FriendCard from "./FriendCard";

const FriendsList = () => {
  const { friends } = useFriends();

  return (
    <GridDisplayer>
      {friends &&
        friends.map((friend) => (
          <FriendCard friend={friend} key={friend._id} />
        ))}
    </GridDisplayer>
  );
};

export default FriendsList;
