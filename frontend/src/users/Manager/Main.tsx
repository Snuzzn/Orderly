import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import styled from "styled-components";
import CategoryTabs from "../../components/menu/CategoryTabs";
import SearchBar from "../../components/menu/SearchBar";
import Navbar from "../../components/navbar/main";
import Restaurant from "../../components/miscPages/Restaurant";
import Category from "./MenuMod/Category/Main";
import MenuMod from "./MenuMod/Main";
import Setup from "./Admin/Main";
import QRCodes from "./Admin/QRCodes";
import ItemDetails from "../../components/menu/itemDetails/ItemDetails";
import Statistics from "./Statistics/Main";
import { AnimatePresence } from "framer-motion";
import Reviews from "../../components/Reviews/Main";
import AddReview from "../../components/Reviews/AddReview";

const Manager = () => {
  const location = useLocation();
  return (
    <Wrapper>
      <Content>
        <AnimatePresence exitBeforeEnter>
          <Routes location={location} key={location.pathname}>
            <Route path="/menu" element={<MenuMod />} />
            <Route path="/menu/:categoryName" element={<Category />} />
            <Route
              path="/menu/:categoryName/:itemId"
              element={<ItemDetails />}
            />
            <Route path="/admin" element={<Setup />} />
            <Route path="/admin/qr" element={<QRCodes />} />
            <Route path='/statistics' element={<Statistics />} />
            <Route
              path="/menu/:category/:itemId/reviews"
              element={<Reviews />}
            />
          </Routes>
        </AnimatePresence>
      </Content>

      <Navbar user="manager" />
    </Wrapper>
  );
};

export default Manager;

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
