import { Stack, Box, Avatar } from "@mui/material";
import { IConversation, IMessage } from "../hooks/useConversation";
import MessageBox from "./MessageBox";
import defaultUserIcon from "../assets/default_user_icon.png";
import { Fragment } from "react/jsx-runtime";

interface Props {
  conversation: IConversation;
}

const MAX_DATE_DIFF = 15 * 1000; // 15 sec

const MessagesList = ({ conversation }: Props) => {
  const getSeenUsers = (message: IMessage) => {
    const seenUsers = [];
    for (const participant of conversation.participants) {
      if (participant.lastSawMessageId === message._id)
        seenUsers.push(participant.user);
    }
    return seenUsers;
  };

  const messagesAreInTheSameGroup = (
    message1: IMessage,
    message2: IMessage
  ) => {
    if (
      !message1.createdAt ||
      !message2.createdAt ||
      message1.sender._id !== message2.sender._id
    )
      return false;

    return (
      Math.abs(
        new Date(message1.createdAt).getTime() -
          new Date(message2.createdAt).getTime()
      ) <= MAX_DATE_DIFF
    );
  };

  let lastMessage: IMessage | undefined = undefined;

  return (
    <Stack
      flexDirection="column-reverse"
      alignItems="flex-end"
      height="100%"
      overflow="auto"
    >
      {conversation.messages.map((message) => {
        const isNewMessagesGroup =
          !lastMessage || !messagesAreInTheSameGroup(message, lastMessage);

        lastMessage = message;
        return (
          <Fragment key={message._id}>
            <Stack direction={"row"}>
              {getSeenUsers(message).map((user) => (
                <Avatar
                  key={user._id}
                  src={user.profilePicture || defaultUserIcon}
                  sx={{ width: 15, height: 15 }}
                />
              ))}
            </Stack>
            <Box
              alignSelf={message.sentByMe ? "flex-end" : "flex-start"}
              paddingBottom={isNewMessagesGroup ? 1 : 0.4}
            >
              <MessageBox
                key={message._id}
                message={message}
                isNewMessagesGroup={isNewMessagesGroup}
              />
            </Box>
          </Fragment>
        );
      })}
    </Stack>
  );
};

export default MessagesList;
