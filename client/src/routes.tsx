import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import RecordAudio from "./pages/RecordAudio";

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/messages" /> },
  { path: "/messages", element: <HomePage /> },
  { path: "/friends", element: <Navigate to="/friends/my" /> },
  { path: "/friends/my", element: <HomePage /> },
  { path: "/friends/requests", element: <HomePage /> },
  { path: "/friends/find", element: <HomePage /> },
  { path: "/settings", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "/record", element: <RecordAudio /> },
]);

export default router;
