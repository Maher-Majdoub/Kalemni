import { useWindowWidth } from "@react-hook/window-size";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const WindowTypeContext = createContext({
  isPhone: false,
  isTablet: false,
  isLaptop: false,
});

export const useWindowTypeContext = () => useContext(WindowTypeContext);

const WindowTypeProvider = ({ children }: { children: ReactNode }) => {
  const windowWidth = useWindowWidth();

  const [windowType, setWindowType] = useState({
    isPhone: false,
    isTablet: false,
    isLaptop: false,
  });

  useEffect(() => {
    setWindowType({
      isLaptop: windowWidth <= 1024,
      isTablet: windowWidth <= 800,
      isPhone: windowWidth <= 700,
    });
  }, [windowWidth]);

  return (
    <WindowTypeContext.Provider value={windowType}>
      {children}
    </WindowTypeContext.Provider>
  );
};

export default WindowTypeProvider;
