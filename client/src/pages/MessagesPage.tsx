import { useEffect } from "react";
import { Stack } from "@mui/material";
import MessagesSection from "../components/MessagesSection";
import ProfileSection from "../components/ProfileSection";
import OnlineUsersSection from "../components/OnlineUsersSection";
import Conversation from "../components/Conversation";
import { useNavigate, useParams } from "react-router-dom";
import { useWindowTypeContext } from "../providers/WindowTypeProvider";
import NavBarContainer from "../components/NavBarContainer";

const MessagesPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (!conversationId) navigate("/conversations");
  }, []);

  const { isPhone } = useWindowTypeContext();

  if (isPhone)
    return <Conversation conversationId={conversationId as string} />;

  return (
    <NavBarContainer>
      <Stack flex={1} direction="row">
        <Stack sx={{ backgroundColor: "#fafafe" }}>
          <ProfileSection />
          <Stack flex={1} minHeight={0} spacing={2} paddingTop={1}>
            <OnlineUsersSection />
            <MessagesSection />
          </Stack>
        </Stack>
        <Conversation conversationId={conversationId as string} />
      </Stack>
    </NavBarContainer>
  );
};

export default MessagesPage;
