import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { createTheme, ThemeProvider } from "@mui/material";
import { io } from "socket.io-client";
import OnlineUsersProvider from "./providers/OnlineFriendsProvider";
import useAddMessage, { IAddMessage } from "./hooks/useAddMessage";

const queryClient = new QueryClient();
const theme = createTheme({
  typography: {
    fontFamily: '"DM Sans", sans-serif',
  },
});

export const socket = io("http://localhost:3000", {
  auth: {
    authToken: localStorage.getItem("auth-token"),
  },
});

const { addMessage } = useAddMessage(queryClient);
socket.on("newMessage", (data: IAddMessage) => addMessage(data));

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <OnlineUsersProvider>
          <RouterProvider router={router} />
          <ReactQueryDevtools />
        </OnlineUsersProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
