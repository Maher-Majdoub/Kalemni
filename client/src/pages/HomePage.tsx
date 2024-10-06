import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Stack } from "@mui/material";
import SideBar from "../components/SideBar";
import MessagesPage from "./MessagesPage";
import FriendsPage from "./FriendsPage";
import { useAuthContext } from "../providers/AuthProvider";
import useListenToConversations from "../hooks/useListenToConversations";

const HomePage = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const currPage = pathname.split("/")[1];
  const [authToken, _] = useAuthContext();

  useListenToConversations();

  useEffect(() => {
    if (!authToken) return navigate("/login");
  }, [authToken]);

  return (
    <Box height="100vh">
      <Stack height="100%" direction="row">
        <SideBar />
        {currPage == "messages" && <MessagesPage />}
        {currPage === "friends" && <FriendsPage />}
      </Stack>
    </Box>
  );
};

export default HomePage;
