import { useEffect } from "react";
import { useSocketContext } from "../providers/SocketProvider";
import { useQueryClient } from "@tanstack/react-query";
import { IMessage } from "./useConversation";
import useAddMessage from "./useAddMessage";
import useSetConversationUserState from "./useSetConversationUserState";

export interface IAddMessage {
  conversationId: string;
  message: IMessage;
  sentByMe: boolean;
}

interface TypingProps {
  conversationId: string;
  userId: string;
  isTyping: boolean;
}

interface SawMessageProps {
  conversationId: string;
  messageId: string;
  userId: string;
}

const useListenToConversations = () => {
  const socket = useSocketContext();
  const queryClient = useQueryClient();
  const { addMessage } = useAddMessage(queryClient);
  const { setConversationUserState } = useSetConversationUserState(queryClient);

  const setIsUserTyping = ({ conversationId, userId, isTyping }: TypingProps) =>
    setConversationUserState(conversationId, userId, { isTyping: isTyping });

  const setUserSawMessage = ({
    conversationId,
    messageId,
    userId,
  }: SawMessageProps) =>
    setConversationUserState(conversationId, userId, {
      lastSawMessageId: messageId,
    });

  const updateConversations = () => {
    queryClient.refetchQueries({ queryKey: ["conversations"] });
  };

  const updateFriendRequests = () => {
    queryClient.refetchQueries({ queryKey: ["friend-requests"] });
  };

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", addMessage);
      socket.on("startTyping", setIsUserTyping);
      socket.on("stopTyping", setIsUserTyping);
      socket.on("sawMessage", setUserSawMessage);
      socket.on("newConversation", updateConversations);
      socket.on("newFriendRequest", updateFriendRequests);
    }
  }, [socket]);
};

export default useListenToConversations;
