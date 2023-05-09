import * as React from "react";
import styled from "styled-components";
import { styled as stitchStyled, keyframes } from "@stitches/react";
import { AnimatePresence } from "framer-motion";
import { Heading, HeadingLevel } from "baseui/heading";
import { TitleCont } from "../../../components/styles";
import "./Main.css";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import PaymentItem from "./PaymentItem";
import { fetchRequest } from "../../../helper/fetchRequest";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { Button } from "baseui/button";
import { EmptyWrapper } from "../../../components/Reviews/Main";
import waiter from "../../../images/waiter.svg";

const ENDPOINT = "http://localhost:3001/";
let socket;
const Bill = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tableId, orgId } = useParams();
  //console.log(`tableId: ${tableId}`);
  // useStates
  const [orderIds, setOrderIds] = React.useState([]);
  const [items, setItems] = React.useState([]);
  const [totalPrice, setTotalPrice] = React.useState(0);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [selectedPrice, setSelectedPrice] = React.useState(0);
  const [isOwnBill, setIsOwnBill] = React.useState(false);
  //const [orgId, setOrgId] = React.useState(0);
  const [tableNum, settableNum] = React.useState(0);
  const [hasLoaded, setHasLoaded] = React.useState(false);

  const getBills = async () => {
    const [data, err] = await fetchRequest(
      `http://localhost:3001/payment/orders/${tableId}`,
      "GET"
    );
    setOrderIds(data.output);
  };
  // get the items when rendering

  const getOrderDetails = async () => {
    let tempItems = [];

    Promise.all(
      orderIds.map(async (num) => {
        const [data, err] = await fetchRequest(
          `http://localhost:3001/order/${num}`,
          "GET"
        );
        const orders = data.output.order;

        const tempOrders = [];
        for (const ord of orders) {
          //console.log(`order: ${order}`);
          if (ord.status !== "Paid") {
            let tempOrder = { ...ord, orderId: parseInt(num) };
            tempOrders.push(tempOrder);
            // tempItems.push(tempOrder);
          }
        }
        return tempOrders;
      })
    ).then((output) => {
      const results = output.filter((item) => {
        return item !== undefined;
      });
      setItems([].concat.apply([], results));
      setTimeout(() => {
        setHasLoaded(true);
      }, 50);
    });
  };

  const getTotalPrice = () => {
    let priceSum = 0;
    for (const item of items) {
      if (item.status !== "Awaiting payment" && item.status !== "Paid")
        priceSum += item.price * item.qty;
    }
    setTotalPrice(priceSum);
  };

  React.useEffect(() => {
    getBills();
    getOrderDetails();
    socket = io(ENDPOINT);
    socket.emit("join", { orgId: orgId });
    socket.on("notification", async (data) => {
      if (data.table === tableId) {
        getOrderDetails();
        getBills();
      }
    });

    socket.on("exception", (data) => {
      if (data.output === 5) {
        toast.error(`Oops! '${data.itemTitle}' hasn't been served yet!`);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  React.useEffect(() => {
    getOrderDetails();
  }, [orderIds]);

  React.useEffect(() => {
    getTotalPrice();
  }, [items]);

  const makePartialPaymentHandler = async () => {
    for (const item of selectedItems) {
      const body = {
        orgId: orgId,
        orderId: item.orderId,
        itemId: item.item_id,
        status: "Awaiting payment",
        role: "Customer",
        tableNum: tableId,
      };
      socket.emit("update_order_status", body);
    }
  };

  const makeAllPaymentHandler = async () => {
    for (const item of items) {
      console.log(item);
      if (item.status === "Preparing" || item.status === "On it's way") {
        toast.error("Not all items have been served!");
        return;
      }
    }

    let status = 0;
    for (const item of items) {
      if (item.status === "Awaiting payment") continue;
      const body = {
        orgId: orgId,
        orderId: item.orderId,
        itemId: item.item_id,
        status: "Awaiting payment",
        role: "Customer",
        tableNum: tableId,
      };

      socket.emit("update_order_status", body);
      // const body = {
      //   order_id: item.orderId,
      //   item_id: item.item_id,
      //   status: "Awaiting payment",
      //   role: "Customer",
      // };
      // const [data, err] = await fetchRequest(
      //   "http://localhost:3001/order/status",
      //   "POST",
      //   body
      // );
      // if (data.output === 5) {
      //   toast.error(`Not so fast! '${item.title}' hasn't been served yet!`);
      //   status = 1;
      // }
      //console.log(data.output);
      status === 0 && navigate("payment");
    }
  };

  return (
    <Cont>
      <HeadingLevel>
        <TitleCont>
          <Heading styleLevel={3}>Bill</Heading>
          <AnimatePresence>
            {items.length !== 0 && (
              <StyledToggleGroup
                type="single"
                value={isOwnBill ? "partial" : "full"}
                onValueChange={(val) => {
                  if (val === "partial") setIsOwnBill(true);
                  else setIsOwnBill(false);
                }}
              >
                <ToggleItem value="partial">Pay Partially</ToggleItem>
                <ToggleItem value="full">Pay in Full</ToggleItem>
              </StyledToggleGroup>
            )}
          </AnimatePresence>
        </TitleCont>
      </HeadingLevel>
      {hasLoaded && (
        <>
          {items.length === 0 ? (
            <EmptyWrapper>
              <img src={waiter} style={{ marginTop: "-70px" }} />
              <div>No items have been ordered yet!</div>
            </EmptyWrapper>
          ) : (
            <div className="bill">
              <div className="bill_heading">
                <ul>
                  <li>
                    <b>Name</b>
                  </li>
                  <li className="space"></li>
                  <li>
                    <b>Status</b>
                  </li>
                  <li>
                    <b>Qty</b>
                  </li>
                  <li>
                    <b>Price</b>
                  </li>
                </ul>
                <hr />
              </div>
              <div className="bill_content">
                <div className="order_items">
                  {items.map((item) => (
                    <PaymentItem
                      item={item}
                      isOwnBill={isOwnBill}
                      selectedPrice={selectedPrice}
                      setSelectedPrice={setSelectedPrice}
                      selectedItems={selectedItems}
                      setSelectedItems={setSelectedItems}
                    />
                  ))}

                  <hr />
                </div>
              </div>
              <div className="bill_total-price">
                <ul>
                  <li>
                    <b>Total</b>
                  </li>
                  <li className="space"></li>
                  <li id="totalPrice">
                    {isOwnBill ? (
                      <b>${selectedPrice.toFixed(2)}</b>
                    ) : (
                      <b>${totalPrice.toFixed(2)}</b>
                    )}
                  </li>
                </ul>
              </div>

              <div className="bill_buttons">
                {/* {isOwnBill ? (
            <button
              onClick={() => {
                setIsOwnBill(false);
              }}
            >
              <b>Whole Bill</b>
            </button>
          ) : (
            <button onClick={() => setIsOwnBill(true)}>
              <b>Select My Own Bill</b>
            </button>
          )} */}
                {!isOwnBill ? (
                  <Button
                    onClick={() => makeAllPaymentHandler()}
                    disabled={totalPrice === 0}
                  >
                    <b>Make Payment</b>
                  </Button>
                ) : (
                  <Button
                    onClick={() => makePartialPaymentHandler()}
                    disabled={selectedPrice === 0}
                  >
                    <b>Make Payment</b>
                  </Button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </Cont>
  );
};

export default Bill;

const Cont = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: calc(90vh - 60px);
`;

const ItemTitle = styled.div`
  font-weight: 500;
  font-size: 13pt;
`;

const Loading = styled.h1`
  color: #eb7347;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

// const ToggleItem = styled(ToggleGroup.Item)`
//   border: none;
//   color:  ${(props) => (props.isActive ? "white" : "blue")}
//   background-color: ${(props) => (props.isActive ? "blue" : "white")};
//   padding: 10px;
//   &[data-state=on]: { background-color: blue; color: red }
// `;

const fadeIn = keyframes({
  "0%": { opacity: "0" },
  "100%": { opacity: "1" },
});

const ToggleItem = stitchStyled(ToggleGroup.Item, {
  border: "none",
  padding: "10px 25px",
  borderRadius: "17px",
  fontSize: "11pt",
  cursor: "pointer",
  "&[data-state=on]": {
    backgroundColor: "#eb7347",
    color: "white",
    animation: `${fadeIn} 300ms ease-out`,
  },
  background: "#E6EBF2",
});

const StyledToggleGroup = styled(ToggleGroup.Root)`
  background-color: #e6ebf2;
  padding: 7px;
  border-radius: 20px;
  align-self: center;
`;
