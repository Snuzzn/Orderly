import React from "react";
import { Route, Routes } from "react-router-dom";
import styled from "styled-components";
import Navbar from "../../components/navbar/main";
import Queue from "../../components/queue/Main";

const Chef = () => {
  return (
    <Wrapper>
      <Content>
        <Routes>
          <Route path="/queue" element={<Queue />} />
        </Routes>
      </Content>

      <Navbar user="chef" />
    </Wrapper>
  );
};

export default Chef;

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
`;

const Content = styled.div`
  overflow: auto;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;
