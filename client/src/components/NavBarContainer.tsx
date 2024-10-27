import {
  Box,
  AppBar,
  Drawer,
  Stack,
  IconButton,
  Typography,
} from "@mui/material";
import { ReactNode, useState } from "react";
import { useWindowTypeContext } from "../providers/WindowTypeProvider";
import SideBar from "./SideBar";
import { HiMiniBars3 } from "react-icons/hi2";
import { useLocation } from "react-router-dom";

const NavBarContainer = ({ children }: { children: ReactNode }) => {
  const [showSideBar, setShowSideBar] = useState(false);
  const { isPhone } = useWindowTypeContext();

  const page = useLocation().pathname.split("/")[1].replaceAll("-", " ");

  if (isPhone) {
    return (
      <Stack height="100vh">
        <AppBar position="static">
          <Stack color="white" direction="row" alignItems="center" spacing={1}>
            <IconButton
              sx={{ width: "fit-content" }}
              onClick={() => setShowSideBar(true)}
            >
              <HiMiniBars3 color="white" />
            </IconButton>
            <Typography
              textTransform="capitalize"
              fontSize="17px"
              fontWeight={500}
            >
              {page}
            </Typography>
          </Stack>
        </AppBar>
        <Drawer open={showSideBar} onClose={() => setShowSideBar(false)}>
          <SideBar onClose={() => setShowSideBar(false)} />
        </Drawer>
        {children}
      </Stack>
    );
  }

  return (
    <Box height="100vh">
      <Stack direction="row" height="100%">
        <SideBar />
        {children}
      </Stack>
    </Box>
  );
};

export default NavBarContainer;
