import { createContext, ReactNode, useEffect, useState } from "react";
import { IUserSnapshot } from "../hooks/useFriends";
import useOnlineFriends from "../hooks/useOnlineFriends";
import { useSocketContext } from "./SocketProvider";

export const OnlineFriendsContext = createContext<IUserSnapshot[]>([]);

const OnlineFriendsProvider = ({ children }: { children: ReactNode }) => {
  const [connectedFriends, setConnectedFriends] = useState<IUserSnapshot[]>([]);
  const socket = useSocketContext();

  const { onlineFriends, isGetOnlineFriendsSuccess } = useOnlineFriends();

  useEffect(() => {
    if (isGetOnlineFriendsSuccess && onlineFriends) {
      const currConnected = [...connectedFriends];
      for (const newConnected of onlineFriends) {
        let isStored = false;
        for (const friend of currConnected) {
          if (friend._id === newConnected._id) {
            isStored = true;
            break;
          }
        }
        if (!isStored) currConnected.push(newConnected);
      }
      setConnectedFriends(currConnected);
    }
  }, [isGetOnlineFriendsSuccess]);

  useEffect(() => {
    if (socket) {
      socket.on("userConnected", (user: IUserSnapshot) => {
        for (const currConnected of connectedFriends)
          if (currConnected._id === user._id) return;

        setConnectedFriends([...connectedFriends, user]);
      });

      socket.on("userDisconnected", (user: IUserSnapshot) => {
        setConnectedFriends(
          connectedFriends.filter((friend) => friend._id !== user._id)
        );
      });
    }
  }, [socket]);

  return (
    <OnlineFriendsContext.Provider value={connectedFriends}>
      {children}
    </OnlineFriendsContext.Provider>
  );
};

export default OnlineFriendsProvider;
