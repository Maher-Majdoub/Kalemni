import { Box, Stack, IconButton } from "@mui/material";
import { TbAlertCircle } from "react-icons/tb";
import { RxExit } from "react-icons/rx";
import NavBar from "./NavBar";
import logoTestImage from "../assets/logo_test_image.png";
import useLogout from "../hooks/useLogout";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
  const { logout } = useLogout();
  const navigate = useNavigate();
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
          <IconButton
            children={<RxExit />}
            onClick={() => {
              logout();
              navigate("/login");
            }}
          />
        </Stack>
      </Stack>
    </Box>
  );
};

export default SideBar;
