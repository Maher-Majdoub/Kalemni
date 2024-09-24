import { Box, Stack, IconButton } from "@mui/material";
import { TbAlertCircle } from "react-icons/tb";
import { RxExit } from "react-icons/rx";
import NavBar from "./NavBar";
import logoTestImage from "../assets/logo_test_image.png";

const SideBar = () => {
  return (
    <Box sx={{ padding: "15px 0" }}>
      <Stack
        spacing={2}
        height="100%"
        sx={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <img src={logoTestImage} width="70px" />
        <NavBar />
        <Stack spacing={1}>
          <IconButton children={<TbAlertCircle />} />
          <IconButton children={<RxExit />} />
        </Stack>
      </Stack>
    </Box>
  );
};

export default SideBar;
