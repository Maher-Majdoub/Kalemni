import {
  Box,
  Stack,
  Avatar,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import { BsThreeDots } from "react-icons/bs";
import { IoCall, IoVideocam } from "react-icons/io5";
import { IConversation } from "../hooks/useConversation";
import OnlineBadge from "./OnlineBadge";
import defaultUserIcon from "../assets/default_user_icon.png";

interface Props {
  conversation: IConversation;
}

const ConversationHeader = ({ conversation }: Props) => {
  const isConnected = true;
  const participants = conversation.participants;
  const friend = participants[0];

  return (
    <>
      <Box padding={2}>
        <Stack
          direction={"row"}
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Stack direction={"row"} spacing={1}>
            <OnlineBadge isConnected={isConnected}>
              <Avatar src={friend.user.profilePicture || defaultUserIcon} />
            </OnlineBadge>
            <Stack>
              <Typography variant="body2">
                {friend.user.firstName} {friend.user.lastName}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Online
              </Typography>
            </Stack>
          </Stack>
          <Stack direction={"row"} spacing={1}>
            <IconButton children={<IoCall />} color="primary" />
            <IconButton children={<IoVideocam />} color="primary" />
            <IconButton children={<BsThreeDots />} color="primary" />
          </Stack>
        </Stack>
      </Box>
      <Divider />
    </>
  );
};

export default ConversationHeader;
