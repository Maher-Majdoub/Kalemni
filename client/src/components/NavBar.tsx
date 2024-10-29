import { Box, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import { AiOutlineMessage } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import useFriendRequests from "../hooks/useFriendRequests";
import useConversations from "../hooks/useConversations";
import NotificationDot from "./NotificationDot";

enum Navigations {
  CONVERSATIONS = "conversations",
  FRIENDS = "friends",
  SETTINGS = "settings",
}

const NavBar = ({ onChange = () => {} }: { onChange?(): void }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const currPage = pathname.split("/")[1];

  const { friendRequests } = useFriendRequests();
  const { conversations } = useConversations();

  const [hasNewFriendRequests, setHasNewFriendsRequests] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(false);

  useEffect(() => {
    if (friendRequests) {
      setHasNewFriendsRequests(friendRequests.length > 0);
    }
  }, [friendRequests]);

  useEffect(() => {
    if (conversations) {
      for (const conversation of conversations) {
        if (conversation.cntNewMessages > 0) {
          setHasNewMessages(true);
          return;
        }
      }
      setHasNewMessages(false);
    }
  }, [conversations]);

  return (
    <Box flex={1}>
      <Tabs
        orientation="vertical"
        role="navigation"
        value={currPage}
        onChange={(_, value) => {
          onChange();
          navigate(`/${value}`);
        }}
        TabIndicatorProps={{
          sx: { left: 0, borderRadius: "0 5px 5px 0", width: "4px" },
        }}
        sx={{ minWidth: "70px" }}
      >
        <Tab
          sx={{ position: "relative", height: "fit-content", minHeight: 0 }}
          icon={<AiOutlineMessage size="20px" />}
          value={Navigations.CONVERSATIONS}
          label={<NotificationDot show={hasNewMessages} />}
        />
        <Tab
          sx={{ position: "relative", height: "fit-content", minHeight: 0 }}
          icon={<FiUsers size="20px" />}
          value={Navigations.FRIENDS}
          label={<NotificationDot show={hasNewFriendRequests} />}
        />
        <Tab
          icon={<IoSettingsOutline size="20px" />}
          value={Navigations.SETTINGS}
        />
      </Tabs>
    </Box>
  );
};

export default NavBar;
