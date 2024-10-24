import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Layout from "./components/Layout";
import MessagesPage from "./pages/MessagesPage";
import ConversationsPage from "./pages/ConversationsPage";
import FriendsPage from "./pages/FriendsPage";
import SettingsPage from "./pages/SettingsPage";
import Call from "./components/Call";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Navigate to="/conversations" /> },
      { path: "/conversations", element: <ConversationsPage /> },
      { path: "/conversations/:conversationId", element: <MessagesPage /> },
      { path: "/friends", element: <Navigate to="/friends/my" /> },
      { path: "/friends/my", element: <FriendsPage /> },
      { path: "/friends/requests", element: <FriendsPage /> },
      { path: "/friends/find", element: <FriendsPage /> },
      { path: "/settings", element: <SettingsPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
      { path: "/call/:conversationId", element: <Call /> },
    ],
  },
]);

export default router;
