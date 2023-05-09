import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import styled from "styled-components";
import Loading from "./components/miscPages/Loading";
import { AuthContext } from "./context/AuthContext";

interface Props {
  isLoggedIn: false;
  children: any;
  userAllowed: string;
}

const Protected: React.FC<Props> = ({ isLoggedIn, children, userAllowed }) => {
  let { userRole, oId, setOid, setUserRole } = useContext(AuthContext);

  if (userRole === "") setUserRole(localStorage.getItem("userRole"));
  if (oId === "") setOid(localStorage.getItem("oId"));
  if (userAllowed === "any" && isLoggedIn) return children;

  if (!isLoggedIn || userAllowed !== localStorage.getItem("userRole")) {
    return <Navigate to="/" replace />;
  }

  return <Loading>{children}</Loading>;
};
export default Protected;
