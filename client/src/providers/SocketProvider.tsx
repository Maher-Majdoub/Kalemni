import { io, Socket } from "socket.io-client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { BASE_URL } from "../services/apiClient";
import { useAuthContext } from "./AuthProvider";

const SocketContext = createContext<Socket | null>(null);

export const useSocketContext = () => useContext(SocketContext);
const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [authToken] = useAuthContext();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (authToken) {
      const newSocket = io(BASE_URL, {
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
