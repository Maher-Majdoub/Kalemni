import { Stack, Tab, Tabs } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import FriendsList from "../components/FriendsList";
import NewFriendsList from "../components/NewFriendsList";
import FriendRequestsList from "../components/FriendRequestsList";
import NavBarContainer from "../components/NavBarContainer";

enum Navigations {
  MY = "my",
  REQUESTS = "requests",
  FIND = "find",
}

const FriendsPage = () => {
  const { pathname } = useLocation();
  const currPage = pathname.split("/")[2];
  const navigate = useNavigate();

  return (
    <NavBarContainer>
      <Stack flex={1} minHeight={0} padding={1} spacing={1}>
        <Tabs
          value={currPage}
          onChange={(_, value) => {
            navigate(`/friends/${value}`);
          }}
        >
          <Tab label="My Friends" value={Navigations.MY} />
          <Tab label="Requests" value={Navigations.REQUESTS} />
          <Tab label="New Friends" value={Navigations.FIND} />
        </Tabs>
        {currPage === Navigations.MY && <FriendsList />}
        {currPage === Navigations.REQUESTS && <FriendRequestsList />}
        {currPage === Navigations.FIND && <NewFriendsList />}
      </Stack>
    </NavBarContainer>
  );
};

export default FriendsPage;
