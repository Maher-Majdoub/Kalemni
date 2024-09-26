import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import FriendsList from "../components/FriendsList";
import NewFriendsList from "../components/NewFriendsList";
import FriendRequestsList from "../components/FriendRequestsList";

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
    <Box>
      <Typography variant="h5">Friends</Typography>
      <Tabs
        value={currPage}
        onChange={(_, value) => {
          navigate(`/friends/${value}`);
        }}
      >
        <Tab label="All My Friends" value={Navigations.MY} />
        <Tab label="Friends Requests" value={Navigations.REQUESTS} />
        <Tab label="Find New Friends" value={Navigations.FIND} />
      </Tabs>
      {currPage === Navigations.MY && <FriendsList />}
      {currPage === Navigations.REQUESTS && <FriendRequestsList />}
      {currPage === Navigations.FIND && <NewFriendsList />}
    </Box>
  );
};

export default FriendsPage;
