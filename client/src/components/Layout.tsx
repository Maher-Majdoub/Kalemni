import { Outlet } from "react-router-dom";
import CallNotifier from "./CallNotifier";
import { ToastContainer } from "react-toastify";
import useListenToConversations from "../hooks/useListenToConversations";

const Layout = () => {
  useListenToConversations();
  return (
    <>
      <ToastContainer position="top-center" autoClose={1500} />
      <CallNotifier />
      <Outlet />
    </>
  );
};

export default Layout;
