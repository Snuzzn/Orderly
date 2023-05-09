import { Checkbox } from "baseui/checkbox";
import React, { useContext } from "react";
import { ImSpinner2 } from "react-icons/im";
import { Socket } from "socket.io-client";
import styled from "styled-components";
import Fade from "../Fade";
import { AuthContext } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { getStatusChanges } from "./Main";
import { Accordion, Panel, StatefulPanel } from "baseui/accordion";

// export type OrderProps = {
//   orderId: string;
//   tableNum: number;
//   status: string;
//   orderTime: string;
// };

type Props = {
  order: OrderProps;
  i: number;
  socket: Socket;
};

export type OrderProps = {
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
  customisations: any;
};

const Order = (props: Props) => {
  const { order, i, socket } = props;
  const { oId, userRole } = useContext(AuthContext);

  const { currStatus, nextStatus } = getStatusChanges(userRole);

  const [checkboxes, setCheckboxes] = React.useState(
    new Array(order.items.length).fill(false)
  );

  React.useEffect(() => {
    const newCheckboxes = order.items.map((item) => item.status === nextStatus);
    setCheckboxes(newCheckboxes);
  }, [order]);

  const updateStatus = (
    orderId: string,
    i: number,
    itemId: string,
    tableNum: string
  ) => {
    // setChecked(true);
    const newCheckboxes = [...checkboxes];
    newCheckboxes[i] = !newCheckboxes[i];
    setCheckboxes(newCheckboxes);

    setTimeout(
      () =>
        socket.emit("update_order_status", {
          status: newCheckboxes[i] ? nextStatus : currStatus,
          orgId: oId,
          orderId: orderId,
          itemId: itemId,
          role: userRole,
          tableNum: tableNum,
        }),
      100
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ease: "easeOut", duration: 0.3 }}
      exit={{ opacity: 0 }}
      layout
    >
      <OrderCont isTable={false}>
        <Flex>
          <Table>Table {order.table_num}</Table>
          <OrderId>#{order.order_id}</OrderId>
        </Flex>
        <OrderInfo>
          <OrderBox>
            <OrderList>
              <Accordion
                overrides={{
                  Root: { style: { width: "100%" } },
                  Header: { style: { background: "blue" } },
                }}
              >
                {order.items.map((item, index) => (
                  <>
                    {item.status === currStatus && (
                      <StatefulPanel
                        title={
                          <>
                            <Checkbox
                              checked={checkboxes[index]}
                              onChange={() =>
                                updateStatus(
                                  order.order_id,
                                  index,
                                  item.item_id,
                                  order.table_num
                                )
                              }
                            ></Checkbox>
                            <ItemTitle
                              isDisabled={
                                Object.keys(item.customisations).length === 0
                              }
                            >
                              {item.title}
                              {Object.keys(item.customisations).length !==
                                0 && <>...</>}
                              &nbsp; x {item.qty}
                            </ItemTitle>
                          </>
                        }
                        disabled={Object.keys(item.customisations).length === 0}
                        overrides={{
                          Header: {
                            style: {
                              background: "none",
                              color:
                                Object.keys(item.customisations).length === 0
                                  ? "#383838"
                                  : "#080606",
                            },
                          },
                          Content: {
                            style: {
                              background: "none",
                              paddingTop: "7px",
                              paddingBottom: "7px",
                            },
                          },
                          ContentAnimationContainer: {
                            style: { outline: "#f7f8fa solid" },
                          },
                          ...(Object.keys(item.customisations).length === 0 && {
                            ToggleIcon: {
                              style: {
                                color: "white",
                              },
                            },
                          }),
                        }}
                      >
                        {Object.entries(item.customisations).map(
                          ([key, val]: [key: string, val: any]) => (
                            <Cust>
                              <CustTitle>{key}:</CustTitle>
                              {val.map((option: any) => (
                                <span>{option.title} · </span>
                              ))}
                            </Cust>
                          )
                        )}
                      </StatefulPanel>
                    )}
                  </>
                ))}
              </Accordion>
            </OrderList>
          </OrderBox>
        </OrderInfo>
      </OrderCont>
    </motion.div>
  );
};

export default Order;

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

const OrderBox = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const OrderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  width: 100%;
`;

const OrderStatus = styled.div`
  font-size: 13pt;
  font-weight: 500;
`;

const CustTitle = styled.div`
  font-size: 12pt;
  margin-bottom: 7px;
  color: #141414;
`;

const Cust = styled.div`
  margin-bottom: 15px;
  color: #474747;
`;

const ItemTitle = styled.div<{ isDisabled: boolean }>`
  margin-right: auto;
  /* color: ${(props) => props.isDisabled && "#474747"}; */
`;
