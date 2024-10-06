import { IConversation } from "../hooks/useConversation";
import { IConversationSnapshot } from "../hooks/useConversations";

export const getConversationPicture = (
  conversation: IConversation | IConversationSnapshot
) => {
  if (conversation.type === "g") {
    if (conversation.picture) return conversation.picture;
  }
  return conversation.participants[0].user.profilePicture;
};
export const getConversationName = (
  conversation: IConversation | IConversationSnapshot
) => {
  if (conversation.type === "p") {
    const friend = conversation.participants[0].user;
    return `${friend.firstName} ${friend.lastName}`;
  }

  return conversation.name;
};

export const getMessageSnapshot = (conversation: IConversationSnapshot) => {
  const lastMessage = conversation.lastMessage;
  if (!lastMessage) return "Start conversation";
  let message = "";
  if (!conversation.isLastMessageSentByMe)
    message += `${lastMessage.sender.firstName}: `;

  message += lastMessage.content;
  return message;
};
