import { Stack } from "@mui/material";
import { useWindowTypeContext } from "../providers/WindowTypeProvider";
import ProfileSection from "../components/ProfileSection";
import NavBarContainer from "../components/NavBarContainer";
import MessagesSection from "../components/MessagesSection";
import OnlineUsersSection from "../components/OnlineUsersSection";

const ConversationsPage = () => {
  const { isPhone } = useWindowTypeContext();

  return (
    <NavBarContainer>
      <Stack direction="row" flex={1} minHeight={0}>
        <Stack
          flex={1}
          minHeight={0}
          sx={{ backgroundColor: "#fafafe" }}
          maxWidth={isPhone ? "100%" : "500px"}
        >
          <ProfileSection />
          <Stack spacing={2} paddingTop={1} minHeight={0}>
            <OnlineUsersSection />
            <MessagesSection />
          </Stack>
        </Stack>
        {!isPhone && (
          <Stack justifyContent="center" alignItems="center" flex={1}>
            Select A Conversation
          </Stack>
        )}
      </Stack>
    </NavBarContainer>
  );
};

export default ConversationsPage;
