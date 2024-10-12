import { Outlet } from "react-router-dom";
import CallNotifier from "./CallNotifier";

const Layout = () => {
  return (
    <>
      <CallNotifier />
      <Outlet />
    </>
  );
};

export default Layout;
