import { RouterProvider } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createTheme, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import router from "./routes";
import AuthProvider from "./providers/AuthProvider";
import SocketProvider from "./providers/SocketProvider";
import OnlineUsersProvider from "./providers/OnlineFriendsProvider";
import WindowTypeProvider from "./providers/WindowTypeProvider";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 0 } },
});

const theme = createTheme({
  typography: {
    fontFamily: '"DM Sans", sans-serif',
  },
});

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <SocketProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
              <OnlineUsersProvider>
                <WindowTypeProvider>
                  <RouterProvider router={router} />
                  <ReactQueryDevtools />
                </WindowTypeProvider>
              </OnlineUsersProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </SocketProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
