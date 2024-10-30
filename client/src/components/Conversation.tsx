import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Drawer, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useWindowTypeContext } from "../providers/WindowTypeProvider";
import ConversationDetails from "./ConversationDetails";
import ConversationHeader from "./ConversationHeader";
import useConversation from "../hooks/useConversation";
import ChatBox from "./ChatBox";

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

  if (!conversation)
    return (
      <Stack
        height="100dvh"
        flex={1}
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress />
      </Stack>
    );

  return (
    <>
      <Stack height="100dvh" flex={1} minHeight={0}>
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
