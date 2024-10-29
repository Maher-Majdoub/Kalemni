import useProfile from "../hooks/useProfile";
import NavBarContainer from "../components/NavBarContainer";
import UpdateLoginInfosForm from "../components/UpdateLoginInfosForm";
import UpdateProfileInfosForm from "../components/UpdateProfileInfosForm";
import { useWindowTypeContext } from "../providers/WindowTypeProvider";
import { Box, CircularProgress, Stack } from "@mui/material";
import UpdateProfilePicture from "../components/UpdateProfilePicture";
const SettingsPage = () => {
  const { profile, isGetProfilePending } = useProfile();
  const { isTablet } = useWindowTypeContext();

  return (
    <NavBarContainer>
      <Box width="100%" padding={2} overflow="auto">
        {isGetProfilePending && (
          <Stack height={"100%"} alignItems="center" justifyContent="center">
            <CircularProgress />
          </Stack>
        )}
        {profile && (
          <Stack spacing={6} alignItems="center">
            <UpdateProfilePicture />
            <Box
              width="100%"
              sx={{
                display: "grid",
                gridTemplateColumns: `repeat(${
                  isTablet || profile.authType !== "normal" ? 1 : 2
                }, minmax(300px, 1fr))`,
                gap: 5,
              }}
            >
              <UpdateProfileInfosForm />
              {profile.authType === "normal" && <UpdateLoginInfosForm />}
            </Box>
          </Stack>
        )}
      </Box>
    </NavBarContainer>
  );
};

export default SettingsPage;
