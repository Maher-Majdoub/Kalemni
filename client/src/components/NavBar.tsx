import { Box, Tab, Tabs } from "@mui/material";
import { AiOutlineMessage } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";

enum Navigations {
  CONVERSATIONS = "conversations",
  FRIENDS = "friends",
  SETTINGS = "settings",
}

const NavBar = ({ onChange = () => {} }: { onChange?(): void }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const currPage = pathname.split("/")[1];

  return (
    <Box flex={1}>
      <Tabs
        orientation="vertical"
        role="navigation"
        value={currPage}
        onChange={(_, value) => {
          onChange();
          navigate(`/${value}`);
        }}
        TabIndicatorProps={{
          sx: { left: 0, borderRadius: "0 5px 5px 0", width: "4px" },
        }}
        sx={{ minWidth: "70px" }}
      >
        <Tab
          icon={<AiOutlineMessage size="20px" />}
          value={Navigations.CONVERSATIONS}
        />
        <Tab icon={<FiUsers size="20px" />} value={Navigations.FRIENDS} />
        <Tab
          icon={<IoSettingsOutline size="20px" />}
          value={Navigations.SETTINGS}
        />
      </Tabs>
    </Box>
  );
};

export default NavBar;
