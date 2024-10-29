import { Badge, styled } from "@mui/material";
import { ReactNode } from "react";
import { useOnlineFriendsProivder } from "../providers/OnlineFriendsProvider";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 1px ${theme.palette.background.paper}`,
    borderRadius: "50%",
    height: "11px",
    width: "11px",
    border: "1px solid white",
  },
}));

interface Props {
  children: ReactNode;
  userId?: string | undefined;
  setOnline?: boolean;
}

const OnlineBadge = ({
  children,
  userId = undefined,
  setOnline = false,
}: Props) => {
  const onlineFriends = useOnlineFriendsProivder();
  const isConnected = !!onlineFriends.find((friend) => friend._id === userId);

  return (
    <StyledBadge
      overlap="circular"
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      variant={isConnected || setOnline ? "dot" : undefined}
    >
      {children}
    </StyledBadge>
  );
};

export default OnlineBadge;
