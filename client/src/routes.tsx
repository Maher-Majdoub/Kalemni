import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Layout from "./components/Layout";
import MessagesPage from "./pages/MessagesPage";
import ConversationsPage from "./pages/ConversationsPage";
import FriendsPage from "./pages/FriendsPage";
import SettingsPage from "./pages/SettingsPage";
import Call from "./components/Call";
import { ReactNode } from "react";
import AboutDeveloperPage from "./pages/AboutDeveloperPage";

const PrivateRoute = ({ element }: { element: ReactNode }) => {
  const token = localStorage.getItem("auth-token");

  return token ? element : <Navigate to="/login" />;
};

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Navigate to="/conversations" /> },
      {
        path: "/conversations",
        element: <PrivateRoute element={<ConversationsPage />} />,
      },
      {
        path: "/conversations/:conversationId",
        element: <PrivateRoute element={<MessagesPage />} />,
      },
      {
        path: "/friends",
        element: <PrivateRoute element={<Navigate to="/friends/my" />} />,
      },
      {
        path: "/friends/my",
        element: <PrivateRoute element={<FriendsPage />} />,
      },
      {
        path: "/friends/requests",
        element: <PrivateRoute element={<FriendsPage />} />,
      },
      {
        path: "/friends/find",
        element: <PrivateRoute element={<FriendsPage />} />,
      },
      {
        path: "/settings",
        element: <PrivateRoute element={<SettingsPage />} />,
      },
      {
        path: "/call/:conversationId",
        element: <PrivateRoute element={<Call />} />,
      },
      {
        path: "/about-developer",
        element: <PrivateRoute element={<AboutDeveloperPage />} />,
      },
      { path: "/signup", element: <SignupPage /> },
      { path: "/login", element: <LoginPage /> },
    ],
  },
]);

export default router;
