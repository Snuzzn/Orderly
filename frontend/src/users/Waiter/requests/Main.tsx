import { Heading, HeadingLevel } from "baseui/heading";
import React, { useContext } from "react";
import styled from "styled-components";
import Fade from "../../../components/Fade";
import DrawerToggleButton from "../../../components/SideDrawer/DrawerToggleButton";
import { TitleCont } from "../../../components/styles";
import { AnimatePresence, motion } from "framer-motion";
import { Checkbox, StatefulCheckbox } from "baseui/checkbox";
import { Socket } from "socket.io-client";
import { AuthContext } from "../../../context/AuthContext";

type Props = {
  socket: Socket;
};

const Requests: React.FC<Props> = ({ socket }) => {
  const [requests, setRequests] = React.useState([]);
  const { oId } = useContext(AuthContext);
  React.useEffect(() => {
    socket.on("assistance", (data) => {
      if (data.success) {
        setRequests(data.output);
      }
    });
    socket.emit("see-assistance", { orgId: oId });
  }, [socket]);

  const handleFinishAssisting = (table: string) => {
    socket.emit("update-assistance", {
      tableId: table,
      orgId: oId,
      requiresAssistance: false,
    });
  };

  return (
    <Fade>
      <HeadingLevel>
        <TitleCont>
          <Heading styleLevel={3}>Requests</Heading>
          <DrawerToggleButton />
        </TitleCont>
      </HeadingLevel>
      <RequestsContainer>
        <AnimatePresence>
          {requests.map((table) => (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ease: "easeOut", duration: 0.3 }}
              exit={{ opacity: 0 }}
              layout
            >
              <ReqWrapper>
                <Table>Table {table}</Table>
                <StatefulCheckbox
                  onChange={() => handleFinishAssisting(table)}
                />
              </ReqWrapper>
            </motion.div>
          ))}
        </AnimatePresence>
      </RequestsContainer>
    </Fade>
  );
};

export default Requests;

const RequestsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ReqWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #f7f8fa;
  padding: 20px;
  border-radius: 10px;
`;

const Table = styled.div`
  font-weight: 500;
  font-size: 14pt;
`;
