import { Box, Stack, IconButton } from "@mui/material";
import { TbAlertCircle } from "react-icons/tb";
import { RxExit } from "react-icons/rx";
import NavBar from "./NavBar";
import logoTestImage from "../assets/logo_test_image.png";
import useLogout from "../hooks/useLogout";
import { useNavigate } from "react-router-dom";

interface Props {
  onClose?(): void;
}

const SideBar = ({ onClose = () => {} }: Props) => {
  const { logout } = useLogout();
  const navigate = useNavigate();
  return (
    <Box height="100%" sx={{ padding: "15px 0" }}>
      <Stack
        spacing={2}
        height="100%"
        sx={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <img src={logoTestImage} className="logo" />
        <NavBar onChange={onClose} />
        <Stack spacing={1}>
          <IconButton children={<TbAlertCircle />} onClick={onClose} />
          <IconButton
            children={<RxExit />}
            onClick={() => {
              logout();
              onClose();
              navigate("/login");
            }}
          />
        </Stack>
      </Stack>
    </Box>
  );
};

export default SideBar;
