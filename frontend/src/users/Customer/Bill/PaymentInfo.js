import React from "react";
import styled from "styled-components";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, KIND } from "baseui/button";
import logo from "../../../images/orderlyLogoWithoutBg.svg";

const PaymentInfo = () => {
  const navigate = useNavigate();
  const { orgId, tableId } = useParams();
  return (
    <Container>
      <ItemImg src={logo} alt="logo" />
      <Title>Thank You!</Title>
      <Info> We hope you had a good meal! Please pay at the counter! </Info>
      <Button
        kind={KIND.secondary}
        onClick={() => navigate(`/restaurant/${orgId}/table/${tableId}/menu`)}
      >
        Go back to menu
      </Button>
    </Container>
  );
};

export default PaymentInfo;

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  display: flex;
  height: 100vh;
  background: linear-gradient(174.67deg, #f19164 4.27%, #ce6838 99.46%);
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 0;
  margin: 0;
`;
const Title = styled.h1`
  color: white;
`;

const Info = styled.h3`
  width: 300px;
  color: white;
  text-align: center;
  line-height: 1.5;
`;

const ItemImg = styled.img`
  width: 150px;
  margin-top: 5rem;
`;

// const Button = styled.button`
//   width: 250px;
//   border: none;
//   border-radius: 20px;
//   background-color: white;
//   color: #eb7347;
//   padding: 15px 40px;
//   cursor: pointer;
//   font-size: 11pt;
// `;
