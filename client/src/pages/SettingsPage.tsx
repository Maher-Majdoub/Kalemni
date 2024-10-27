import useProfile from "../hooks/useProfile";
import NavBarContainer from "../components/NavBarContainer";
import UpdateLoginInfosForm from "../components/UpdateLoginInfosForm";
import UpdateProfileInfosForm from "../components/UpdateProfileInfosForm";
import { useWindowTypeContext } from "../providers/WindowTypeProvider";
import { Box, Stack } from "@mui/material";
import UpdateProfilePicture from "../components/UpdateProfilePicture";
const SettingsPage = () => {
  const { profile } = useProfile();
  const { isTablet } = useWindowTypeContext();

  if (!profile) return <p>wait...</p>;

  return (
    <NavBarContainer>
      <Box width="100%" padding={2} overflow="auto">
        <Stack spacing={6} alignItems="center">
          <UpdateProfilePicture />
          <Box
            width="100%"
            sx={{
              display: "grid",
              gridTemplateColumns: `repeat(${
                isTablet ? 1 : 2
              }, minmax(300px, 1fr))`,
              gap: 5,
            }}
          >
            <UpdateProfileInfosForm />
            {profile.authType === "normal" && <UpdateLoginInfosForm />}
          </Box>
        </Stack>
      </Box>
    </NavBarContainer>
  );
};

export default SettingsPage;
