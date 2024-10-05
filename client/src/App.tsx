import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { createTheme, ThemeProvider } from "@mui/material";
import { io } from "socket.io-client";
import OnlineUsersProvider from "./providers/OnlineFriendsProvider";
import useAddMessage, { IAddMessage } from "./hooks/useAddMessage";
import { IConversation } from "./hooks/useConversation";

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

socket.on(
  "startTyping",
  ({ conversationId, userId }: { conversationId: string; userId: string }) => {
    queryClient.setQueryData(
      ["conversation", conversationId],
      (oldData: IConversation) => {
        if (!oldData) return;
        return {
          ...oldData,
          participants: oldData.participants.map((participant) => {
            if (participant.user._id === userId)
              return { ...participant, isTyping: true };

            return participant;
          }),
        };
      }
    );
  }
);

socket.on(
  "stopTyping",
  ({ conversationId, userId }: { conversationId: string; userId: string }) => {
    queryClient.setQueryData(
      ["conversation", conversationId],
      (oldData: IConversation) => {
        if (!oldData) return;
        return {
          ...oldData,
          participants: oldData.participants.map((participant) => {
            if (participant.user._id === userId)
              return { ...participant, isTyping: false };

            return participant;
          }),
        };
      }
    );
  }
);

socket.on(
  "seenMessage",
  ({
    conversationId,
    messageId,
    userId,
  }: {
    conversationId: string;
    messageId: string;
    userId: string;
  }) => {
    console.log("here");
    queryClient.setQueryData(
      ["conversation", conversationId],
      (oldData: IConversation) => {
        if (!oldData) return;
        return {
          ...oldData,
          participants: oldData.participants.map((participant) => {
            if (participant.user._id === userId)
              return { ...participant, lastSeenMessageId: messageId };

            return participant;
          }),
        };
      }
    );
  }
);

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
