import { io, Socket } from "socket.io-client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const SocketContext = createContext<Socket | null>(null);

export const useSocketContext = () => useContext(SocketContext);
const SocketProvider = ({ children }: { children: ReactNode }) => {
  const authToken = localStorage.getItem("auth-token");

  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (authToken) {
      const newSocket = io("http://localhost:3000", {
        auth: {
          authToken: localStorage.getItem("auth-token"),
        },
      });
      setSocket(newSocket);
    }
  }, [authToken]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
