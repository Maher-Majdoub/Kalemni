import { Skeleton, Stack } from "@mui/material";

const ProfileSnapshotSkeleton = () => {
  return (
    <Stack direction="row" spacing={2}>
      <Skeleton variant="circular" width={40} height={40} />
      <Stack>
        <Skeleton height={20} width={70} />
        <Skeleton height={15} width={40} />
      </Stack>
    </Stack>
  );
};

export default ProfileSnapshotSkeleton;
