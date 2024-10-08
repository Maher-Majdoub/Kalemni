import { Box, Typography } from "@mui/material";

const DropArea = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "red",
      }}
    >
      <Typography>Add File</Typography>
    </Box>
  );
};

export default DropArea;
