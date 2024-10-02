import { Stack, Typography, Box } from "@mui/material";
import { CiSearch } from "react-icons/ci";
import LastConversationsList from "./LastConversationsList";

interface Props {
  selectedConversationId: string | undefined;
  onSelectConversation(conversationId: string): void;
}

const MessagesSection = ({
  selectedConversationId,
  onSelectConversation,
}: Props) => {
  return (
    <Stack spacing={1}>
      <Typography variant="subtitle1" paddingLeft={3} paddingRight={3}>
        Messages
      </Typography>
      <Box paddingLeft={3} paddingRight={3}>
        <Stack
          direction="row"
          alignItems="center"
          padding={1}
          borderRadius={2}
          sx={{ backgroundColor: "white" }}
        >
          <CiSearch size={20} />
          <input placeholder="Search" />
        </Stack>
      </Box>
      <LastConversationsList
        selectedConversationId={selectedConversationId}
        onSelectConversation={onSelectConversation}
      />
    </Stack>
  );
};

export default MessagesSection;
