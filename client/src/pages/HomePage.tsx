import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Stack } from "@mui/material";
import SideBar from "../components/SideBar";
import MessagesPage from "./MessagesPage";
import FriendsPage from "./FriendsPage";

const HomePage = () => {
  const navigate = useNavigate();

  const { pathname } = useLocation();
  const currPage = pathname.split("/")[1];

  useEffect(() => {
    const authToken = localStorage.getItem("auth-token");
    if (!authToken) {
      return navigate("/login");
    }
  }, []);

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
