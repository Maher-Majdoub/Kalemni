import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useProfile from "../hooks/useProfile";
import useFriends from "../hooks/useFriends";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("auth-token");
    if (!authToken) {
      return navigate("/login");
    }
  }, []);

  const { profile } = useProfile();

  const { friends, isGetFriendsSuccess } = useFriends();

  if (isGetFriendsSuccess) {
    console.log(friends);
  }

  return (
    <main>
      <h1>
        {profile?.firstName} {profile?.lastName}
      </h1>
      {isGetFriendsSuccess && (
        <>
          <h4>Friends</h4>
          <ul>
            {friends?.map((friend) => (
              <li
                key={friend._id}
                onClick={() => {
                  navigate(`/friends/${friend._id}/messages`);
                }}
              >
                {friend.firstName} {friend.lastName}
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
};

export default HomePage;
