import { Paper, Stack, IconButton, Box } from "@mui/material";
import { BiSolidLike } from "react-icons/bi";
import { BsSendFill } from "react-icons/bs";
import { FaSmile } from "react-icons/fa";
import { GrAttachment } from "react-icons/gr";
import { IoMdAddCircleOutline } from "react-icons/io";
import { PiMicrophone } from "react-icons/pi";
import { useForm } from "react-hook-form";
import { useState } from "react";

interface Props {
  onSendMessage({ message }: { message: { content: string } }): void;
}

const MessageInputSection = ({ onSendMessage }: Props) => {
  const { register, handleSubmit, setValue } = useForm();
  const [isWritting, setIsWritting] = useState(false);

  const onSubmit = handleSubmit((data) => {
    onSendMessage({ message: { content: data.message } });
    setValue("message", "");
  });

  return (
    <Paper elevation={5} sx={{ padding: 1, margin: "8px 0", borderRadius: 3 }}>
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
        <Box width="100%">
          <form autoComplete="off" onSubmit={onSubmit}>
            <Stack direction="row" spacing={1}>
              <Stack
                direction="row"
                bgcolor="lightgray"
                width="100%"
                padding="2px"
                borderRadius={3}
              >
                <input
                  {...register("message", { required: true })}
                  type="text"
                  autoComplete=""
                  placeholder="Your Message..."
                  onChange={(e) => setIsWritting(!!e.target.value)}
                />
                <IconButton
                  children={<FaSmile />}
                  size="small"
                  color="primary"
                />
              </Stack>
              {isWritting ? (
                <IconButton
                  children={<BsSendFill />}
                  size="small"
                  color="primary"
                  type="submit"
                />
              ) : (
                <IconButton
                  children={<BiSolidLike />}
                  size="small"
                  color="primary"
                />
              )}
            </Stack>
          </form>
        </Box>
      </Stack>
    </Paper>
  );
};

export default MessageInputSection;
