import { Box } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const ColoredContainer = ({ children }: Props) => {
  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        background: "linear-gradient(120deg, #a6c0fe 0%, #f68084 100%)",
      }}
    >
      {children}
    </Box>
  );
};

export default ColoredContainer;
