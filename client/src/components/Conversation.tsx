import { useEffect, useState } from "react";
import ChatBox from "./ChatBox";
import ConversationDetails from "./ConversationDetails";
import useConversation from "../hooks/useConversation";
import { Drawer, Stack } from "@mui/material";
import ConversationHeader from "./ConversationHeader";
import { useWindowTypeContext } from "../providers/WindowTypeProvider";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Conversation = ({ conversationId }: { conversationId: string }) => {
  const [showDetails, setShowDetails] = useState(false);
  const { conversation, isGetConversationError, getConversationError } =
    useConversation(conversationId);
  const navigate = useNavigate();

  const { isLaptop } = useWindowTypeContext();

  useEffect(() => {
    if (isGetConversationError && getConversationError?.message) {
      toast.error(getConversationError.message);
      navigate("/conversations");
    }
  }, [isGetConversationError]);

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
      {!isLaptop && showDetails && <ConversationDetails />}
      {isLaptop && (
        <Drawer
          open={showDetails}
          anchor="right"
          onClose={() => setShowDetails(false)}
        >
          <ConversationDetails onClose={() => setShowDetails(false)} />
        </Drawer>
      )}
    </>
  );
};

export default Conversation;
