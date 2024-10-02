import { useState } from "react";
import { Box, Stack } from "@mui/material";
import MessagesSection from "../components/MessagesSection";
import ChatBox from "../components/ChatBox";
import ProfileSection from "../components/ProfileSection";
import OnlineUsersSection from "../components/OnlineUsersSection";

const MessagesPage = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | undefined
  >(undefined);

  return (
    <Stack direction="row" height="100%" width="100%">
      <Box minWidth="300px" sx={{ backgroundColor: "#fafafe" }}>
        <ProfileSection />
        <Stack spacing={2} paddingTop={1} width="100%">
          <OnlineUsersSection />
          <MessagesSection
            selectedConversationId={selectedConversationId}
            onSelectConversation={setSelectedConversationId}
          />
        </Stack>
      </Box>
      {selectedConversationId && (
        <ChatBox conversationId={selectedConversationId} />
      )}
    </Stack>
  );
};

export default MessagesPage;
