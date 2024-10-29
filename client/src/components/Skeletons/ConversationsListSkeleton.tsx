import { Stack } from "@mui/material";
import ConversationSanpshotSkeleton from "./ConversationSanpshotSkeleton";

const ConversationsListSkeleton = () => {
  return (
    <Stack paddingLeft={3} paddingRight={3} width="100%" spacing={1}>
      {[1, 2, 3, 4, 5].map((id) => (
        <ConversationSanpshotSkeleton key={id} />
      ))}
    </Stack>
  );
};

export default ConversationsListSkeleton;
