import { Stack, Skeleton } from "@mui/material";

const UserCardSkeleton = () => {
  return (
    <Stack boxShadow="0 0 8px 2px #eee" borderRadius={2} overflow="hidden">
      <Skeleton variant="rectangular" width="100%" height="180px" />
      <Stack padding={2} spacing={1}>
        <Skeleton variant="rectangular" height={20} width={100} />
        <Skeleton variant="rectangular" height={45} width="100%" />
        <Skeleton variant="rectangular" height={45} width="100%" />
      </Stack>
    </Stack>
  );
};

export default UserCardSkeleton;
