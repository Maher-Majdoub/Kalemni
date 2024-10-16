import { Stack } from "@mui/material";
import MessagesSection from "../components/MessagesSection";
import OnlineUsersSection from "../components/OnlineUsersSection";
import ProfileSection from "../components/ProfileSection";
import NavBarContainer from "../components/NavBarContainer";

const ConversationsPage = () => {
  return (
    <NavBarContainer>
      <Stack flex={1} minHeight={0} sx={{ backgroundColor: "#fafafe" }}>
        <ProfileSection />
        <Stack spacing={2} paddingTop={1} minHeight={0}>
          <OnlineUsersSection />
          <MessagesSection />
        </Stack>
      </Stack>
    </NavBarContainer>
  );
};

export default ConversationsPage;
