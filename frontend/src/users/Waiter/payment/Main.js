import React from "react";
import Payment from "./Payment";
import styled from "styled-components";
import { Heading, HeadingLevel } from "baseui/heading";
import { TitleCont } from "../../../components/styles";
import { AuthContext } from "../../../context/AuthContext";
import { fetchRequest } from "../../../helper/fetchRequest";
import io from "socket.io-client";
import { motion } from "framer-motion";
import DrawerToggleButton from "../../../components/SideDrawer/DrawerToggleButton";

const ENDPOINT = "http://localhost:3001/";
let socket;

const Payments = () => {
  const [tableIds, setTableIds] = React.useState([]);
  const { oId } = React.useContext(AuthContext);

  React.useEffect(() => {
    socket = io(ENDPOINT);

    return () => {
      socket.disconnect();
    };
  }, []);

  let tempList = [];

  const getTableIds = async () => {
    const [data, err] = await fetchRequest(
      `http://localhost:3001/order-queue/${oId}`,
      "GET"
    );
    let p = data.queue;

    p.map((item) => {
      let i = tempList.filter((t) => t === item.table_num);
      i.length === 0 && (tempList = [...tempList, item.table_num]);
    });
    setTableIds(tempList);
  };

  React.useEffect(() => {
    getTableIds();
  }, []);

  return (
    <div>
      <HeadingLevel>
        <TitleCont>
          <Heading styleLevel={3}>Payments</Heading>
          <DrawerToggleButton />
        </TitleCont>
      </HeadingLevel>
      <Container>
        {tableIds.map((id) => (
          <Payment tableId={id} key={id} socket={socket} />
        ))}
      </Container>
    </div>
  );
};

export default Payments;

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Loading = styled.h1`
  color: #eb7347;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;
