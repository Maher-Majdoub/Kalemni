import { Badge, styled } from "@mui/material";

const OnlineBadge = styled(Badge)(({ theme }) => ({
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

export default OnlineBadge;
