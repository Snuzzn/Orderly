import React from "react";
import { Route, Routes, useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import Cart from "./Cart/Main";
import CategoryTabs from "../../components/menu/CategoryTabs";
import ItemDetails from "../../components/menu/itemDetails/ItemDetails";
import SearchBar from "../../components/menu/SearchBar";
import Navbar from "../../components/navbar/main";
import { AnimatePresence, motion } from "framer-motion";
import Fade from "../../components/Fade";
import Queue from "./Queue/Main";
import Bill from "./Bill/Main";
import PaymentInfo from "./Bill/PaymentInfo";
import Reviews from "../../components/Reviews/Main";
import AddReview from "../../components/Reviews/AddReview";
import { IoHandLeft, IoHandRightOutline } from "react-icons/io5";
import { fetchRequest } from "../../helper/fetchRequest";
import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";

const ENDPOINT = "http://localhost:3001/";
let socket: Socket;

const Customer = () => {
  const location = useLocation();
  const { orgId, tableId } = useParams();
  const [needsHelp, setNeedsHelp] = React.useState(false);

  React.useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("join", { orgId: orgId });
    socket.on("assistance", (data) => {
      if (data.success) {
        if (tableId && data.output.includes(tableId)) {
          toast(
            "Assistance has been requested. A server will be with you shortly!",
            { icon: "✋" }
          );
          setNeedsHelp(true);
        } else setNeedsHelp(false);
      }
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Wrapper>
      <Content>
        <AssistanceBtn needsHelp={needsHelp} />
        <AnimatePresence exitBeforeEnter>
          <Routes location={location} key={location.pathname}>
            <Route
              path="/menu"
              element={
                <Fade>
                  <MarginLess>
                    <SearchBar />
                    <CategoryTabs />
                  </MarginLess>
                </Fade>
              }
            />
            <Route path="/menu/:itemId" element={<ItemDetails />} />
            <Route path="/menu/:itemId/reviews" element={<Reviews />} />
            <Route path="/menu/:itemId/reviews/add" element={<AddReview />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/queue" element={<Queue />} />
            <Route path="/bill" element={<Bill />} />
            <Route path="/bill/payment" element={<PaymentInfo />} />
          </Routes>
        </AnimatePresence>
      </Content>

      <Navbar user="restaurant" />
    </Wrapper>
  );
};

export default Customer;

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
  height: 100%;
`;

const MarginLess = styled.div`
  margin: -20px;
`;

type AssistProps = {
  needsHelp: boolean;
};

const AssistanceBtn: React.FC<AssistProps> = ({ needsHelp }) => {
  const handleAssistance = async () => {
    // const [data, err] = await fetchRequest(
    //   `http://localhost:3001/assistance/${orgId}`,
    //   "POST",
    //   {
    //     tableNum: tableId,
    //     requiresAssistance: true,
    //   }
    // );
    // console.log(data);
    socket.emit("update-assistance", {
      tableId: tableId,
      orgId: orgId,
      requiresAssistance: !needsHelp,
    });
  };

  const { orgId, tableId } = useParams();

  const location = useLocation();
  const [pos, setPos] = React.useState("botRight");
  React.useEffect(() => {
    if (location.pathname.includes("queue")) setPos("topRight");
    if (location.pathname.includes("cart")) setPos("topRight");
    if (location.pathname.includes("menu")) setPos("botRight");
    if (location.pathname.includes("bill")) setPos("higherBotRight");
    if (location.pathname.includes("menu/")) setPos("highestTopRight");
    if (location.pathname.includes("reviews")) setPos("topRight");
  }, [location]);

  let styles = {};
  if (pos === "botRight") {
    styles = {
      // bottom: "120px",
      right: "20px",
      top: "calc(100vh - 180px)",
    };
  } else if (pos === "topRight")
    styles = {
      right: "20px",
      top: "25px",
      // bottom: "initial",
    };
  else if (pos === "higherBotRight")
    styles = {
      right: "20px",
      top: "calc(100vh - 250px)",
    };
  else if (pos === "highestTopRight") {
    styles = {
      right: "10px",
      top: "15px",
      zIndex: "100",
    };
  } else if (pos === "none")
    styles = {
      display: "none",
    };

  return (
    <HelpIcon
      isSelected={needsHelp}
      onClick={handleAssistance}
      style={styles}
    />
  );
};

const HelpIcon = styled(IoHandRightOutline)<{ isSelected: boolean }>`
  /* border: 2px solid #white; */
  background-color: ${(props) => (props.isSelected ? "#e87f58" : "white")};
  /* border: 2px solid white; */
  color: ${(props) => (props.isSelected ? "white" : "grey")};
  cursor: pointer;
  position: fixed;
  bottom: 115px;
  right: 10px;
  width: 1.5rem;
  height: 1.5rem;
  padding: 15px;
  border-radius: 50%;
  transform: rotate(30deg);
  transition: all 400ms ease-in-out;
  z-index: 2;
  box-shadow: ${(props) =>
    props.isSelected
      ? "rgb(205 132 98) 0px 5px 12px"
      : "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px,rgba(0, 0, 0, 0.3) 0px 3px 7px -3px"};
`;
