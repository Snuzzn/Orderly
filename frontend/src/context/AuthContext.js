import { createContext } from "react";
import React from "react";
export const AuthContext = createContext();

export const CustomAuthomProvider = ({ children }) => {
  const [uId, setUid] = React.useState("");
  const [oId, setOid] = React.useState("");
  const [accessToken, setAccessToken] = React.useState("");
  const [userRole, setUserRole] = React.useState("");

  const updateUserRole = (role) => {
    setUserRole(role);
    localStorage.setItem("userRole", role);
  };

  return (
    <AuthContext.Provider
      value={{
        uId,
        setUid,
        oId,
        setOid,
        accessToken,
        setAccessToken,
        userRole,
        setUserRole,
        updateUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
