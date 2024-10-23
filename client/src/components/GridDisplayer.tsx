import { Box } from "@mui/material";
import { ReactNode } from "react";

const GridDisplayer = ({ children }: { children: ReactNode }) => {
  return (
    <Box flex={1} minHeight={0} overflow="auto">
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          alignItems: "stretch",
          gap: 2,
        }}
        padding={1}
      >
        {children}
      </Box>
    </Box>
  );
};

export default GridDisplayer;
