import React, { FC, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Restaurant from "./components/miscPages/Restaurant";
import { withAuthInfo } from "@propelauth/react";
import { AuthContext } from "./context/AuthContext";
import Protected from "./Protected";
import Manager from "./users/Manager/Main";
import Customer from "./users/Customer/Main";
import Waiter from "./users/Waiter/Main";
import Login from "./components/auth/Login";
import PaymentInfo from "./users/Customer/Bill/PaymentInfo";
import Loading from "./components/miscPages/Loading";
import Error from "./components/miscPages/Error";
import Chef from "./users/Chef/Main";

const App: FC<any> = (props) => {
  const { setUid, setAccessToken, setUserRole, accessToken } =
    useContext(AuthContext);

  React.useEffect(() => {
    if (props.isLoggedIn) {
      setUid(props.user.userId);
      setAccessToken(props.accessToken);
    }
  }, []);

  return (
    <Routes>
      <Route
        path="/your-restaurants"
        element={
          <Protected isLoggedIn={props.isLoggedIn} userAllowed="any">
            <Restaurant />
          </Protected>
        }
      />
      <Route
        path="/manager/*"
        element={
          <Protected isLoggedIn={props.isLoggedIn} userAllowed="Manager">
            <Manager />
          </Protected>
        }
      />
      <Route
        path="/restaurant/:orgId/table/:tableId/*"
        element={
          <Loading>
            <Customer />
          </Loading>
        }
      />
      <Route
        path="/waiter/*"
        element={
          <Protected isLoggedIn={props.isLoggedIn} userAllowed="Waiter">
            <Waiter />
          </Protected>
        }
      />
      <Route
        path="/chef/*"
        element={
          <Protected isLoggedIn={props.isLoggedIn} userAllowed="Chef">
            <Chef />
          </Protected>
        }
      />
      <Route path="/" element={<Login />} />
      <Route path="*" element={<Error />} />
      <Route path="/payment" element={<PaymentInfo />} />
    </Routes>
  );
};

export default withAuthInfo(App);
