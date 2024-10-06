import { Stack, Typography, Box, IconButton } from "@mui/material";
import { CiSearch } from "react-icons/ci";
import { IoIosAddCircleOutline } from "react-icons/io";
import ConversationsList from "./ConversationsList";
import AddConversationDialog from "./AddConversationDialog";
import { useState } from "react";

interface Props {
  selectedConversationId: string | undefined;
  onSelectConversation(conversationId: string): void;
}

const MessagesSection = ({
  selectedConversationId,
  onSelectConversation,
}: Props) => {
  const [showCreateGroupDialog, setShowCreateGroupDialog] = useState(false);

  return (
    <>
      <Stack spacing={1}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          paddingLeft={3}
          paddingRight={3}
        >
          <Typography variant="subtitle1">Messages</Typography>
          <IconButton onClick={() => setShowCreateGroupDialog(true)}>
            <IoIosAddCircleOutline />
          </IconButton>
        </Stack>
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
        <ConversationsList
          selectedConversationId={selectedConversationId}
          onSelectConversation={onSelectConversation}
        />
      </Stack>
      <AddConversationDialog
        open={showCreateGroupDialog}
        onClose={() => setShowCreateGroupDialog(false)}
      />
    </>
  );
};

export default MessagesSection;
