import { Skeleton, Stack } from "@mui/material";

const ConversationSanpshotSkeleton = () => {
  return (
    <Stack direction="row" spacing={2} width="100%">
      <Skeleton variant="circular" width={40} height={40} />
      <Stack>
        <Skeleton height={20} width={60} />
        <Skeleton height={20} width={200} />
      </Stack>
      <Stack flex={1} alignItems="end" alignSelf="end">
        <Skeleton height={20} width={35} />
        <Skeleton height={20} width={20} />
      </Stack>
    </Stack>
  );
};

export default ConversationSanpshotSkeleton;
