import { Outlet } from "react-router-dom";
import CallNotifier from "./CallNotifier";
import useListenToConversations from "../hooks/useListenToConversations";

const Layout = () => {
  useListenToConversations();
  return (
    <>
      <CallNotifier />
      <Outlet />
    </>
  );
};

export default Layout;
