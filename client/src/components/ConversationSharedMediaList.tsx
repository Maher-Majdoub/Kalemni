import { Stack, Typography, Box } from "@mui/material";
import useSharedMedia from "../hooks/useSharedMedia";
import { useParams } from "react-router-dom";

const ConversationSharedMediaList = () => {
  const { conversationId } = useParams();
  const { sharedMedia } = useSharedMedia(conversationId as string);
  return (
    <Stack spacing={1} flex={1} minHeight={0} padding="0 15px 20px">
      <Typography fontWeight="600" fontSize={17}>
        Shared Media
      </Typography>
      <Box
        flex={1}
        minHeight={0}
        overflow="auto"
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
          gap: 0.5,
        }}
      >
        {sharedMedia?.map((media) => (
          <Box key={media._id} width="100%">
            {media.type === "image" && <img width="100%" src={media.src} />}
            {media.type === "video" && (
              <video width="100%" src={media.src} controls />
            )}
          </Box>
        ))}
      </Box>
    </Stack>
  );
};

export default ConversationSharedMediaList;
