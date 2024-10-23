import { IConversation } from "../hooks/useConversation";
import { IConversationSnapshot } from "../hooks/useConversations";
import { IUserSnapshot } from "../hooks/useFriends";

export const getConversationPicture = (
  conversation: IConversation | IConversationSnapshot
) => {
  if (conversation.type === "g" && conversation.picture)
    return conversation.picture;

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
  let sender: IUserSnapshot | undefined = conversation.lastMessage
    ?.sender as IUserSnapshot;
  if (!sender?.firstName) {
    const user = conversation.participants.find(
      (participant) => participant.user._id === lastMessage?.sender
    );
    sender = user?.user;
  }

  if (!lastMessage) return "Start conversation";
  let message = "";
  if (!conversation.isLastMessageSentByMe) message += `${sender?.firstName}: `;

  if (lastMessage.type == "audio") message += "Sent a voice message";
  else if (lastMessage.type === "image") message += "Sent an image";
  else if (lastMessage.type === "video") message += "Sent a video";
  else message += lastMessage.content;

  return message;
};
