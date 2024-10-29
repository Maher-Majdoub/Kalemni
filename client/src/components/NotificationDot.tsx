import { Box } from "@mui/material";

const NotificationDot = ({ show }: { show: boolean }) => {
  if (!show) return <></>;
  return (
    <Box
      position="absolute"
      top={9}
      right={29}
      borderRadius="50%"
      bgcolor="#bf0000"
      width={8}
      height={8}
    />
  );
};

export default NotificationDot;
