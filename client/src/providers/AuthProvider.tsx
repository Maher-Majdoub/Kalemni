import { createContext, ReactNode, useContext, useState } from "react";

const AuthContext = createContext<
  [string | null, React.Dispatch<React.SetStateAction<string | null>>]
>([null, () => {}]);

export const useAuthContext = () => useContext(AuthContext);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("auth-token")
  );

  return (
    <AuthContext.Provider value={[authToken, setAuthToken]}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
