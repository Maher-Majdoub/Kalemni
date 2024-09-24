import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { createTheme, ThemeProvider } from "@mui/material";

const queryClient = new QueryClient();
const theme = createTheme({
  typography: {
    fontFamily: '"DM Sans", sans-serif',
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
        {/* <ReactQueryDevtools /> */}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
