import { Badge, styled } from "@mui/material";
import { ReactNode } from "react";

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
  isConnected: boolean;
  children: ReactNode;
}

const OnlineBadge = ({ isConnected, children }: Props) => (
  <StyledBadge
    overlap="circular"
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    variant={isConnected ? "dot" : undefined}
  >
    {children}
  </StyledBadge>
);

export default OnlineBadge;
