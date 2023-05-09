import React, { useContext } from "react";
import toast from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import styled from "styled-components";
import Navbar from "../../components/navbar/main";
import Queue from "../../components/queue/Main";
import { AuthContext } from "../../context/AuthContext";
import Payments from "./payment/Main";
import Requests from "./requests/Main";

const ENDPOINT = "http://localhost:3001/";
let socket: Socket;
socket = io(ENDPOINT);

const Waiter = () => {
  const { oId } = useContext(AuthContext);
  React.useEffect(() => {
    socket.emit("join", { orgId: oId });

    socket.on("assistance-notif", (data) => {
      console.log(data);
      toast(`Table ${data.tableId} has requested assistance!`, { icon: "✋" });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Wrapper>
      <Content>
        <Routes>
          <Route path="/queue" element={<Queue />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/requests" element={<Requests socket={socket} />} />
        </Routes>
      </Content>

      <Navbar user="waiter" />
    </Wrapper>
  );
};

export default Waiter;

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
  justify-content: space-between;
`;

const Content = styled.div`
  overflow: auto;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;
