import { Avatar, Stack, Typography } from "@mui/material";
import useConversation from "../hooks/useConversation";
import { useWindowTypeContext } from "../providers/WindowTypeProvider";
import ConversationDetailsHeader from "./ConversationDetailsHeader";
import ConversationSharedMediaList from "./ConversationSharedMediaList";
import { useParams } from "react-router-dom";
import ConversationTools from "./ConversationTools";

interface Props {
  onClose?(): void;
}

const ConversationDetails = ({ onClose = () => {} }: Props) => {
  const { conversationId } = useParams();
  const { conversation } = useConversation(conversationId as string);
  const { isLaptop } = useWindowTypeContext();

  if (!conversation) return <p>wait...</p>;

  return (
    <Stack
      borderLeft="1px solid #eee"
      maxWidth={isLaptop ? "min(80vw, 400px)" : "300px"}
      flex={1}
      position="relative"
      minWidth="300px"
      height="100dvh"
      spacing={3}
    >
      <ConversationDetailsHeader onClose={onClose} />
      {conversation.type === "g" && (
        <Stack spacing={1} padding="0 15px">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography fontWeight="600" fontSize={17}>
              {conversation.participants.length} Particpants
            </Typography>
            <ConversationTools />
          </Stack>
          <Stack spacing={1.5}>
            {conversation.participants.slice(0, 3).map((participant) => (
              <Stack
                key={participant.user._id}
                direction="row"
                spacing={1}
                alignItems={"center"}
              >
                <Avatar
                  src={participant.user.profilePicture}
                  sx={{ width: 30, height: 30 }}
                />
                <Typography>
                  {participant.user.firstName} {participant.user.lastName}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
      )}
      <ConversationSharedMediaList />
    </Stack>
  );
};

export default ConversationDetails;
