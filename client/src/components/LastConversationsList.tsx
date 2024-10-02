import { Stack, ButtonBase, Avatar, Typography } from "@mui/material";
import OnlineBadge from "./OnlineBadge";
import useConversations, {
  IConversationSnapshot,
} from "../hooks/useConversations";
import defaultUserIcon from "../assets/default_user_icon.png";
import { IUserSnapshot } from "../hooks/useFriends";

interface Props {
  selectedConversationId: string | undefined;
  onSelectConversation(conversationId: string): void;
}

const extractMessageSnapshot = (
  conversation: IConversationSnapshot,
  friend: IUserSnapshot
) => {
  const lastMessage = conversation.lastMessage;
  if (!lastMessage) return "Start conversation";
  let message = "";
  if (!conversation.isLastMessageSentByMe) message += `${friend.firstName}: `;

  message += lastMessage.content;
  return message;
};

const LastConversationsList = ({
  selectedConversationId,
  onSelectConversation,
}: Props) => {
  const { conversations } = useConversations();

  if (selectedConversationId) {
  }

  return (
    <Stack>
      {conversations &&
        conversations.map((conversation) => {
          if (conversation.type === "p") {
            const friend = conversation.participants[0];

            return (
              <ButtonBase
                sx={{ display: "block", textAlign: "left" }}
                key={conversation._id}
                onClick={() => {
                  onSelectConversation(conversation._id);
                }}
              >
                <Stack
                  direction="row"
                  padding="10px 0"
                  alignItems="center"
                  justifyContent="space-between"
                  paddingLeft={3}
                  paddingRight={3}
                >
                  <Stack direction="row" spacing={2}>
                    <OnlineBadge isConnected>
                      <Avatar src={friend.profilePicture || defaultUserIcon} />
                    </OnlineBadge>
                    <Stack>
                      <Typography variant="subtitle2">
                        {friend.firstName} {friend.lastName}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="gray"
                        sx={{
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          maxWidth: "150px",
                        }}
                      >
                        {extractMessageSnapshot(conversation, friend)}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Avatar
                    sx={{
                      width: 20,
                      height: 20,
                      fontSize: 13,
                      marginLeft: 2,
                      backgroundColor: "blue",
                    }}
                  >
                    2
                  </Avatar>
                </Stack>
              </ButtonBase>
            );
          }
        })}
    </Stack>
  );
};

export default LastConversationsList;
