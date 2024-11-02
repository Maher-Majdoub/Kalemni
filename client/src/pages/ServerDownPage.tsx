import { Stack, Typography } from "@mui/material";
import usePingServer from "../hooks/usePingServer";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ServerDownPage = () => {
  const { pingServer, isSuccess } = usePingServer();
  const navigate = useNavigate();

  useEffect(() => {
    pingServer();
  }, []);

  useEffect(() => {
    if (isSuccess) navigate("/");
  }, [isSuccess]);

  return (
    <Stack height="100dvh" alignItems="center" justifyContent="center">
      <Typography variant="h5">
        Our servers are currently down. Please try again later.
      </Typography>
    </Stack>
  );
};

export default ServerDownPage;
