import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import Call from "./components/Call";
import Layout from "./components/Layout";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Navigate to="/messages" /> },
      { path: "/messages", element: <HomePage /> },
      { path: "/friends", element: <Navigate to="/friends/my" /> },
      { path: "/friends/my", element: <HomePage /> },
      { path: "/friends/requests", element: <HomePage /> },
      { path: "/friends/find", element: <HomePage /> },
      { path: "/settings", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
      { path: "/call/:conversationId", element: <Call /> },
    ],
  },
]);

export default router;
