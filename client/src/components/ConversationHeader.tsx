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
import {
  getConversationPicture,
  getConversationName,
} from "../services/conversationServices";
import { useNavigate } from "react-router-dom";
import { PiDotsThreeCircleFill } from "react-icons/pi";
import { useWindowTypeContext } from "../providers/WindowTypeProvider";
import { FaArrowLeft } from "react-icons/fa";

interface Props {
  conversation: IConversation;
  showDetails: boolean;
  onToggleShowDetails(): void;
}

const ConversationHeader = ({
  conversation,
  showDetails,
  onToggleShowDetails,
}: Props) => {
  const isConnected = true;

  const navigate = useNavigate();
  const { isPhone } = useWindowTypeContext();

  const call = () => {
    navigate(`/call/${conversation._id}`);
  };

  return (
    <Box>
      <Box padding={2}>
        <Stack
          direction={"row"}
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Stack direction={"row"} spacing={1} alignItems="center">
            {isPhone && (
              <Box>
                <IconButton
                  onClick={() => navigate("/conversations")}
                  color="primary"
                  size="small"
                >
                  <FaArrowLeft />
                </IconButton>
              </Box>
            )}
            <OnlineBadge isConnected={isConnected}>
              <Avatar src={getConversationPicture(conversation)} />
            </OnlineBadge>
            <Stack>
              <Typography variant="body2">
                {getConversationName(conversation)}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Online
              </Typography>
            </Stack>
          </Stack>
          <Stack direction={"row"} spacing={1}>
            <IconButton children={<IoCall />} color="primary" />
            <IconButton
              children={<IoVideocam />}
              color="primary"
              onClick={call}
            />
            <IconButton
              children={
                showDetails ? <PiDotsThreeCircleFill /> : <BsThreeDots />
              }
              color="primary"
              onClick={onToggleShowDetails}
            />
          </Stack>
        </Stack>
      </Box>
      <Divider />
    </Box>
  );
};

export default ConversationHeader;
