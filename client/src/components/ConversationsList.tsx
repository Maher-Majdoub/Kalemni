import { Stack, ButtonBase, Avatar, Typography } from "@mui/material";
import OnlineBadge from "./OnlineBadge";
import useConversations from "../hooks/useConversations";
import {
  getConversationName,
  getConversationPicture,
  getMessageSnapshot,
} from "../services/conversationServices";
import { useNavigate } from "react-router-dom";
import { MdDone } from "react-icons/md";
import ConversationsListSkeleton from "./Skeletons/ConversationsListSkeleton";

const getTimeFromDate = (date: any) => {
  const d = new Date(date);
  let hours = d.getHours();
  let minutes = d.getMinutes().toString();
  let ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes.length < 2 ? "0" + minutes : minutes;

  return hours + ":" + minutes + " " + ampm;
};

const ConversationsList = () => {
  const { conversations, isConversationsPending } = useConversations();
  const navigate = useNavigate();

  if (isConversationsPending) return <ConversationsListSkeleton />;

  return (
    <Stack sx={{ overflowY: "auto" }}>
      {conversations &&
        conversations.map((conversation) => {
          return (
            <ButtonBase
              sx={{ display: "block", textAlign: "left" }}
              key={conversation._id}
              onClick={() => {
                navigate(`/conversations/${conversation._id}`);
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
                  <OnlineBadge
                    userId={
                      conversation.type === "g"
                        ? undefined
                        : conversation.participants[0].user._id
                    }
                  >
                    <Avatar
                      src={getConversationPicture(conversation)}
                      sx={{ width: 45, height: 45 }}
                    />
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
                <Stack alignItems="flex-end">
                  {conversation.lastMessage?.createdAt && (
                    <Typography fontSize={13} fontWeight={600}>
                      {getTimeFromDate(conversation.lastMessage.createdAt)}
                    </Typography>
                  )}
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
                  {conversation.isLastMessageSentByMe && (
                    <MdDone color="primary" fontSize={18} />
                  )}
                </Stack>
              </Stack>
            </ButtonBase>
          );
        })}
    </Stack>
  );
};

export default ConversationsList;
