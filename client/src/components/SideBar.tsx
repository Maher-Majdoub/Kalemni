import {
  Box,
  Stack,
  IconButton,
  Button,
  Dialog,
  Typography,
  Tooltip,
} from "@mui/material";
import { TbAlertCircle } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { RxExit } from "react-icons/rx";
import NavBar from "./NavBar";
import useLogout from "../hooks/useLogout";
import logo from "../assets/logo.png";

interface Props {
  onClose?(): void;
}

const SideBar = ({ onClose = () => {} }: Props) => {
  const { logout } = useLogout();
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  return (
    <Box height="100%" sx={{ padding: "15px 0" }}>
      <Stack
        spacing={2}
        height="100%"
        sx={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <img src={logo} className="logo" />
        <NavBar onChange={onClose} />
        <Stack spacing={1}>
          <Tooltip title="About Developer">
            <IconButton
              children={<TbAlertCircle />}
              onClick={() => {
                navigate("/about-developer");
                onClose();
              }}
            />
          </Tooltip>
          <Tooltip title="Logout">
            <IconButton
              children={<RxExit />}
              onClick={() => setShowLogoutDialog(true)}
            />
          </Tooltip>
        </Stack>
      </Stack>
      <Dialog open={showLogoutDialog}>
        <Stack spacing={2} padding={2}>
          <Typography>Are you sure want to logout</Typography>
          <Stack direction="row" justifyContent="end" spacing={1}>
            <Button onClick={() => setShowLogoutDialog(false)}>Cancel</Button>
            <Button
              color="error"
              onClick={() => {
                logout();
                onClose();
                setShowLogoutDialog(false);
                navigate("/login");
              }}
            >
              Logout
            </Button>
          </Stack>
        </Stack>
      </Dialog>
    </Box>
  );
};

export default SideBar;
