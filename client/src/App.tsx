import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";
import router from "./routes";
import AuthProvider from "./providers/AuthProvider";
import SocketProvider from "./providers/SocketProvider";
import OnlineUsersProvider from "./providers/OnlineFriendsProvider";

const queryClient = new QueryClient();
const theme = createTheme({
  typography: {
    fontFamily: '"DM Sans", sans-serif',
  },
});

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <OnlineUsersProvider>
              <RouterProvider router={router} />
              <ReactQueryDevtools />
            </OnlineUsersProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
