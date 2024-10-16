import { useState } from "react";
import ChatBox from "./ChatBox";
import ConversationDetails from "./ConversationDetails";
import useConversation from "../hooks/useConversation";
import { Drawer, Stack } from "@mui/material";
import ConversationHeader from "./ConversationHeader";
import { useWindowTypeContext } from "../providers/WindowTypeProvider";

const Conversation = ({ conversationId }: { conversationId: string }) => {
  const [showDetails, setShowDetails] = useState(false);
  const { conversation } = useConversation(conversationId);

  const { isLaptop } = useWindowTypeContext();

  if (!conversation) return <p>wait...</p>;

  return (
    <>
      <Stack height="100vh" flex={1} minHeight={0}>
        <ConversationHeader
          conversation={conversation}
          showDetails={showDetails}
          onToggleShowDetails={() => setShowDetails(!showDetails)}
        />
        <ChatBox conversation={conversation} />
      </Stack>
      {!isLaptop && showDetails && (
        <ConversationDetails conversation={conversation} />
      )}
      {isLaptop && (
        <Drawer
          open={showDetails}
          anchor="right"
          onClose={() => setShowDetails(false)}
        >
          <ConversationDetails
            conversation={conversation}
            onClose={() => setShowDetails(false)}
          />
        </Drawer>
      )}
    </>
  );
};

export default Conversation;
