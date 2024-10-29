import { Stack, Typography, IconButton } from "@mui/material";
import { IoIosAddCircleOutline } from "react-icons/io";
import ConversationsList from "./ConversationsList";
import AddConversationDialog from "./AddConversationDialog";
import { useState } from "react";

const MessagesSection = () => {
  const [showCreateGroupDialog, setShowCreateGroupDialog] = useState(false);

  return (
    <Stack flex={1} spacing={1} minHeight={0}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        paddingLeft={2}
        paddingRight={2}
      >
        <Typography variant="subtitle1">Messages</Typography>
        <IconButton onClick={() => setShowCreateGroupDialog(true)}>
          <IoIosAddCircleOutline />
        </IconButton>
      </Stack>
      <ConversationsList />
      <AddConversationDialog
        open={showCreateGroupDialog}
        onClose={() => setShowCreateGroupDialog(false)}
      />
    </Stack>
  );
};

export default MessagesSection;
