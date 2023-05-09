import { Heading, HeadingLevel } from "baseui/heading";
import React from "react";
import { TitleCont } from "../../../components/styles";
import io, { Socket } from "socket.io-client";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { ImSpinner2 } from "react-icons/im";
import Fade from "../../../components/Fade";
import { Button } from "baseui/button";
import { motion, AnimatePresence } from "framer-motion";
import PreparingIcon from "../../../images/preparing.svg";
import DarkPreparingIcon from "../../../images/darkPreparing.svg";
import ServingIcon from "../../../images/onItsWay.svg";
import DarkServingIcon from "../../../images/darkOnItsWay.svg";
import CheckIcon from "../../../images/check.svg";
import DarkCheckIcon from "../../../images/darkCheck.svg";
import { StatefulTooltip } from "baseui/tooltip";
import { fetchRequest } from "../../../helper/fetchRequest";
import { OrderProps } from "../../../components/queue/Order";
import toast from "react-hot-toast";
import { AiOutlineDollarCircle } from "react-icons/ai";

type Props = {};
const ENDPOINT = "http://localhost:3001/";
let socket: Socket;

type Order = {
  order_id: string;
  table_num: string;
  items: Item[];
};

type Item = {
  item_id: string;
  price: number;
  qty: number;
  status: string;
  title: string;
};

const Queue = (props: Props) => {
  const { orgId, tableId } = useParams();

  const [orders, setOrders] = React.useState<Order[]>([]);

  React.useEffect(() => {
    socket = io(ENDPOINT);

    socket.emit("join", { orgId: orgId });

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
      setOrders(
        data.queue.filter(
          (order: OrderProps) =>
            !order.items.every(
              (item) =>
                item.status === "Served" ||
                item.status === "Awaiting payment" ||
                item.status === "Paid"
            )
        )
      );
    });
    socket.on("notification", async (data) => {
      if (data.table === tableId) {
        const itemName = await fetchItemName(data.itemId);
        toast(
          `Your table's '${itemName}' is ${data.newStatus.toLowerCase()}!`,
          {
            icon: "😋",
          }
        );
      }
    });
  }, []);

  return (
    <Fade>
      <HeadingLevel>
        <TitleCont>
          <Heading styleLevel={3}>Queue</Heading>
        </TitleCont>
      </HeadingLevel>
      <Orders>
        <AnimatePresence>
          {orders.map((order: any) => (
            <motion.div
              layout
              key={order.orderId}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ease: "easeOut", duration: 0.3 }}
              exit={{ opacity: 0 }}
            >
              <OrderCont isTable={order.table_num.toString() === tableId}>
                <Flex isTable={order.table_num.toString() === tableId}>
                  <Table>Table {order.table_num}</Table>
                  <OrderTime isTable={order.table_num.toString() === tableId}>
                    <StatefulTooltip content={prepTimeObj[order.prep_time]}>
                      {order.prep_time}
                    </StatefulTooltip>
                  </OrderTime>
                </Flex>
                {order.table_num.toString() === tableId && (
                  <OrderInfo>
                    <Order>
                      <OrderList>
                        {order.items.map((item: any) => (
                          <>
                            <OrderInfo>
                              <StatefulTooltip content={item.status}>
                                {renderIcon(item.status, false)}
                              </StatefulTooltip>

                              <div>
                                {item.title}
                                {item.qty > 1 && <>&nbsp; x {item.qty}</>}
                              </div>
                            </OrderInfo>
                          </>
                        ))}
                      </OrderList>
                    </Order>
                  </OrderInfo>
                )}
              </OrderCont>
            </motion.div>
          ))}
        </AnimatePresence>
      </Orders>
      {/* <form onSubmit={createOrder}>
        <input
          type="text"
          value={val}
          onChange={(e) => setVal(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form> */}
    </Fade>
  );
};

export default Queue;

const prepTimeObj: any = {
  SM: "Small",
  MD: "Medium",
  LG: "Large",
  XL: "Extra Large",
};

export const renderIcon = (status: string, isDark: boolean) => {
  if (status === "Preparing")
    return (
      <FadingIcon>
        <img
          src={isDark ? DarkPreparingIcon : PreparingIcon}
          alt=""
          width="30px"
        />
      </FadingIcon>
    );
  else if (status === "On it's way")
    return (
      <FadingIcon>
        <img src={isDark ? DarkServingIcon : ServingIcon} alt="" width="30px" />
      </FadingIcon>
    );
  else if (status === "Awaiting payment" && isDark)
    return <AiOutlineDollarCircle size="30px" color="#686868" />;
  else
    return <img src={isDark ? DarkCheckIcon : CheckIcon} alt="" width="30px" />;
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

const OrderTime = styled.div<{ isTable: boolean }>`
  padding: 10px;
  background-color: ${(props) => (props.isTable ? "#F7C7AD" : "#e8e8e8")};
  border-radius: 10px;
  color: ${(props) => (props.isTable ? "#F19164" : "#9b9b9b")};
  font-weight: 500;
`;

const Table = styled.div`
  font-weight: 600;
  font-size: 14pt;
`;

const Flex = styled.div<{ isTable: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: ${(props) => props.isTable && "10px"};
`;

const OrderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const Spinner = styled(ImSpinner2)`
  animation: spinner 2s linear infinite;
  width: 1.5em;
  height: 1.5em;
  @keyframes spinner {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Order = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const OrderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 13px;
`;

const OrderStatus = styled.div`
  font-size: 13pt;
  font-weight: 500;
`;

export const FadingIcon = styled.div`
  animation: fadeInAndOut 0.8s infinite alternate;
  @keyframes fadeInAndOut {
    from {
      opacity: 0.4;
    }
  }
`;
