import { Box, Stack, Tab, Tabs } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import FriendsList from "../components/FriendsList";
import NewFriendsList from "../components/NewFriendsList";
import FriendRequestsList from "../components/FriendRequestsList";
import NavBarContainer from "../components/NavBarContainer";
import useFriendRequests from "../hooks/useFriendRequests";
import { useEffect, useState } from "react";

enum Navigations {
  MY = "my",
  REQUESTS = "requests",
  FIND = "find",
}

const RequestsLabel = ({ hasNewFriends }: { hasNewFriends: boolean }) => {
  return (
    <Box position="relative">
      Requests
      {hasNewFriends && (
        <Box
          position="absolute"
          top={0}
          right={-10}
          borderRadius="50%"
          bgcolor="#bf0000"
          width={8}
          height={8}
        />
      )}
    </Box>
  );
};

const FriendsPage = () => {
  const { pathname } = useLocation();
  const currPage = pathname.split("/")[2];
  const navigate = useNavigate();

  const { friendRequests } = useFriendRequests();
  const [hasNewFriendRequests, setHasNewFriendsRequests] = useState(false);

  useEffect(() => {
    if (friendRequests) {
      setHasNewFriendsRequests(friendRequests.length > 0);
    }
  }, [friendRequests]);

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
          <Tab
            label={<RequestsLabel hasNewFriends={hasNewFriendRequests} />}
            value={Navigations.REQUESTS}
          />
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
