import {
  Avatar,
  Box,
  Divider,
  IconButton,
  List,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { IoCall, IoVideocam } from "react-icons/io5";
import { PiMicrophone } from "react-icons/pi";
import { BsSendFill } from "react-icons/bs";
import { GrAttachment } from "react-icons/gr";
import { useState } from "react";
import { BiSolidLike } from "react-icons/bi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaSmile } from "react-icons/fa";
import OnlineBadge from "./OnlineBadge";
import userTestImage from "../assets/user_test_image.png";

interface Props {
  conversationId: string;
}

const ChatBox = ({ conversationId }: Props) => {
  const isConnected = true;
  const [isWritting, setIsWritting] = useState(false);

  if (conversationId) {
  }

  return (
    <Box width="100%" sx={{ height: "100%" }}>
      <Stack height="100%">
        <Box padding={2}>
          <Stack
            direction={"row"}
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Stack direction={"row"} spacing={1}>
              <OnlineBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant={isConnected ? "dot" : undefined}
              >
                <Avatar src={userTestImage} />
              </OnlineBadge>
              <Stack>
                <Typography variant="body2">Flen Fouleni</Typography>
                <Typography variant="caption" color="textSecondary">
                  Online
                </Typography>
              </Stack>
            </Stack>
            <Stack direction={"row"} spacing={1}>
              <IconButton children={<IoCall />} color="primary" />
              <IconButton children={<IoVideocam />} color="primary" />
            </Stack>
          </Stack>
        </Box>
        <Divider />
        <Box sx={{ flex: 1, overflow: "auto" }}>
          <List></List>
        </Box>
        <Paper
          elevation={5}
          sx={{ padding: 1, margin: "8px 0", borderRadius: 3 }}
        >
          <Stack direction="row" spacing={1}>
            <Stack direction="row" spacing={1}>
              <IconButton children={<IoMdAddCircleOutline />} size="small" />
              {!isWritting && (
                <>
                  <IconButton children={<PiMicrophone />} size="small" />
                  <IconButton children={<GrAttachment />} size="small" />
                </>
              )}
            </Stack>
            <Stack
              direction="row"
              bgcolor="lightgray"
              width="100%"
              padding="2px"
              borderRadius={3}
            >
              <input
                type="text"
                placeholder="Your Message..."
                onChange={(e) => setIsWritting(!!e.target.value)}
              />
              <IconButton children={<FaSmile />} size="small" color="primary" />
            </Stack>
            {isWritting ? (
              <IconButton
                children={<BsSendFill />}
                size="small"
                color="primary"
              />
            ) : (
              <IconButton
                children={<BiSolidLike />}
                size="small"
                color="primary"
              />
            )}
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
};

export default ChatBox;
