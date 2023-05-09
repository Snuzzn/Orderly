import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "@propelauth/react";
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
import { LightTheme, BaseProvider, styled } from "baseui";
import { StatefulInput } from "baseui/input";
import { customTheme } from "./customTheme";
import { BrowserRouter } from "react-router-dom";
import { ThemeContext } from "styled-components";
import { CustomAuthomProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import toast, { Toaster } from "react-hot-toast";

const engine = new Styletron();
ReactDOM.render(
  <React.StrictMode>
    <StyletronProvider value={engine}>
      <BaseProvider theme={customTheme}>
        <BrowserRouter>
          <AuthProvider authUrl={`https://7854248030.propelauthtest.com`}>
            <CustomAuthomProvider>
              <AppProvider>
                <App />
              </AppProvider>
            </CustomAuthomProvider>
          </AuthProvider>
        </BrowserRouter>
        <Toaster />
      </BaseProvider>
    </StyletronProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
