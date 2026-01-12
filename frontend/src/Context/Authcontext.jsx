import { createContext, useContext, useState } from "react";

export const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthContextProvider = ({ children }) => {
  const [authUser, setauthUser] = useState(
    JSON.parse(localStorage.getItem("chatapp")) || null
  );

  return (
    <AuthContext.Provider value={{ authUser, setauthUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
