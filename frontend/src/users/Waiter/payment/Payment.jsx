import React, { useContext } from "react";
import styled from "styled-components";
import { fetchRequest } from "../../../helper/fetchRequest";
import { Button } from "baseui/button";
import { AuthContext } from "../../../context/AuthContext";
import { motion } from "framer-motion";

const Payment = ({ tableId, socket }) => {
  const [price, setPrice] = React.useState(0);
  const [awaitingPayedItems, setAwaitingPayedItems] = React.useState([]);
  const { oId } = useContext(AuthContext);

  React.useEffect(() => {
    socket.emit("join", { orgId: oId });

    socket.on("notification", async (data) => {
      if (data.newStatus === "Awaiting payment") getOrderDetails();
    });
  }, []);

  const getOrderDetails = async () => {
    // get all order ids of the table
    const [data, err] = await fetchRequest(
      `http://localhost:3001/payment/orders/${tableId}`,
      "GET"
    );
    const orderIds = data.output;

    // find 'Awaiting payment' items for each order
    Promise.all(
      orderIds.map(async (num) => {
        const [data, err] = await fetchRequest(
          `http://localhost:3001/order/${num}`,
          "GET"
        );
        const items = data.output.order;

        // get total price of the order (for items awaiting payment)
        const price = items.reduce(
          (acc, item) =>
            item.status === "Awaiting payment"
              ? acc + item.price * item.qty
              : acc,
          0
        );

        // get items to be paid
        const itemsToBePaid = items.filter(
          (item) => item.status === "Awaiting payment"
        );
        for (let i = 0; i < itemsToBePaid.length; i++) {
          itemsToBePaid[i] = { ...itemsToBePaid[i], order_id: num };
        }

        return {
          price: price,
          items: itemsToBePaid,
        };
      })
    ).then((output) => {
      setPrice(output.reduce((acc, item) => (item.price += acc), 0));
      const tempItems = output.map((item) => [...item.items]);
      setAwaitingPayedItems([].concat.apply([], tempItems));
    });
  };

  React.useEffect(() => {
    getOrderDetails();
  }, []);

  const acceptPaymentHandler = async () => {
    for (const item of awaitingPayedItems) {
      const body = {
        orgId: oId,
        orderId: item.order_id,
        itemId: item.item_id,
        status: "Paid",
        role: "Waiter",
        tableNum: tableId,
      };
      socket.emit("update_order_status", body);
    }
    // status === 0 && toast.success(`Accepting Table ${tableId}'s Payment!`);
    getOrderDetails();
  };

  return (
    awaitingPayedItems.length > 0 && (
      <motion.div
        layout
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Wrapper>
          <OrderCont>
            <Flex>
              <Table>
                Table {tableId} - ${price}
              </Table>
            </Flex>
            <OrderInfo>
              <OrderBox>
                <OrderList>
                  <div>
                    {awaitingPayedItems.map((item) => (
                      <p>{item.title}</p>
                    ))}
                  </div>
                </OrderList>
              </OrderBox>
            </OrderInfo>
          </OrderCont>
          <Button
            onClick={() => acceptPaymentHandler()}
            overrides={{
              Root: { style: { borderRadius: "20px" } },
            }}
          >
            Accept Payment
          </Button>
        </Wrapper>
      </motion.div>
    )
  );
};

export default Payment;

const OrderCont = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  color: black;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #f6f8fa;
  color: black;
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
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
`;
