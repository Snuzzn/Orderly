import { Heading, HeadingLevel } from "baseui/heading";
import React, { useContext } from "react";
import io, { Socket } from "socket.io-client";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { ImSpinner2 } from "react-icons/im";
import { Button } from "baseui/button";
import Fade from "../Fade";
import { TitleCont } from "../styles";
import { AuthContext } from "../../context/AuthContext";
import { Checkbox } from "baseui/checkbox";
import { motion, AnimatePresence } from "framer-motion";
import Order, { OrderProps } from "./Order";
import DrawerToggleButton from "../SideDrawer/DrawerToggleButton";
import toast from "react-hot-toast";

type Props = {};
const ENDPOINT = "http://localhost:3001/";
let socket: Socket;

const Queue = (props: Props) => {
  const { oId, accessToken, userRole } = useContext(AuthContext);

  const { currStatus, nextStatus } = getStatusChanges(userRole);

  const [orders, setOrders] = React.useState([]);
  const [checkboxes, setCheckboxes] = React.useState<boolean[]>([]);
  // console.log(checkboxes);

  React.useEffect(() => {
    socket = io(ENDPOINT);

    socket.emit("join", { orgId: oId });
    return () => {
      socket.disconnect();
    };
  }, []);

  React.useEffect(() => {
    const fetchItemName = async (itemId: string) => {
      const res = await fetch(`http://localhost:3001/menu/item/${itemId}`);
      const data = await res.json();
      return data.title;
    };
    socket.on("orders", (data) => {
      // only show details of orders if they have with items that are of the current status
      setOrders(
        data.queue.filter((order: OrderProps) =>
          order.items.some((item) => item.status === currStatus)
        )
      );
    });

    socket.on("notification", async (data) => {
      if (data.itemId) {
        const itemName = await fetchItemName(data.itemId);
        if (data.newStatus === currStatus)
          toast(
            `Order #${data.orderId}: '${itemName}' is ready to be served at Table ${data.table}!`,
            {
              icon: "🍴",
            }
          );
      } else {
        if (data.newStatus === currStatus)
          toast(`New order #${data.orderId} for Table ${data.table}!`, {
            icon: "🔥",
          });
      }
    });
  }, []);

  return (
    <Fade>
      <HeadingLevel>
        <TitleCont>
          <Heading styleLevel={3}>Queue</Heading>
          <DrawerToggleButton />
        </TitleCont>
      </HeadingLevel>
      {/* <form onSubmit={createOrder}>
        <input
          type="text"
          value={val}
          onChange={(e) => setVal(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form> */}
      <Orders>
        <AnimatePresence>
          {orders.map((order: OrderProps, i: number) => (
            <Order order={order} i={i} socket={socket} key={order.order_id} />
          ))}
        </AnimatePresence>
      </Orders>
    </Fade>
  );
};

export default Queue;

export const getStatusChanges = (userRole: string) => {
  switch (userRole) {
    case "Chef":
      return { nextStatus: "On it's way", currStatus: "Preparing" };
    case "Waiter":
      return { nextStatus: "Served", currStatus: "On it's way" };
    default:
      return { nextStatus: null, currStatus: null };
  }
};

const Orders = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const OrderCont = styled.div<{ isTable: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  background-color: ${(props) => (props.isTable ? "#F19164" : "#f6f8fa")};
  color: ${(props) => (props.isTable ? "white" : "black")};
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
`;

const OrderId = styled.div`
  padding: 7px 10px;
  background-color: #e8e8e8;
  border-radius: 10px;
  color: #9b9b9b;
  font-weight: 500;
`;

const Table = styled.div`
  font-weight: 600;
  font-size: 14pt;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const OrderInfo = styled.div`
  display: flex;
  gap: 15px;
`;

export const Spinner = styled(ImSpinner2)`
  animation: spinner 2s linear infinite;
  width: 1.5em;
  height: 1.5em;
  color: #686868;
  @keyframes spinner {
    to {
      transform: rotate(360deg);
    }
  }
`;

const OrderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

const OrderStatus = styled.div`
  font-size: 13pt;
  font-weight: 500;
`;
