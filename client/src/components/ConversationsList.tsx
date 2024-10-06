import { Stack, ButtonBase, Avatar, Typography } from "@mui/material";
import OnlineBadge from "./OnlineBadge";
import useConversations from "../hooks/useConversations";
import {
  getConversationName,
  getConversationPicture,
  getMessageSnapshot,
} from "../services/conversationServices";

interface Props {
  selectedConversationId: string | undefined;
  onSelectConversation(conversationId: string): void;
}

const ConversationsList = ({ onSelectConversation }: Props) => {
  const { conversations } = useConversations();

  return (
    <Stack>
      {conversations &&
        conversations.map((conversation) => {
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
                    <Avatar src={getConversationPicture(conversation)} />
                  </OnlineBadge>
                  <Stack>
                    <Typography variant="subtitle2">
                      {getConversationName(conversation)}
                    </Typography>
                    <Typography
                      variant="caption"
                      color={conversation.cntNewMessages > 0 ? "black" : "gray"}
                      sx={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        maxWidth: "150px",
                        fontWeight:
                          conversation.cntNewMessages > 0 ? "bold" : "300",
                      }}
                    >
                      {getMessageSnapshot(conversation)}
                    </Typography>
                  </Stack>
                </Stack>
                {conversation.cntNewMessages > 0 && (
                  <Avatar
                    sx={{
                      width: 20,
                      height: 20,
                      fontSize: 13,
                      marginLeft: 2,
                      backgroundColor: "blue",
                    }}
                  >
                    <Typography variant="caption">
                      {Math.min(conversation.cntNewMessages, 9).toString()}
                      {conversation.cntNewMessages > 9 ? "+" : ""}
                    </Typography>
                  </Avatar>
                )}
              </Stack>
            </ButtonBase>
          );
        })}
    </Stack>
  );
};

export default ConversationsList;
