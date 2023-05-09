import React from "react";
import AuthButtons from "./AuthButtons";
import styled from "styled-components";
import logo from "../../images/orderlyLogoWithoutBg.svg";

const Login = () => {
  return (
    <Container>
      <Logo>
        <ItemImg src={logo} alt="logo" />
        <Title>Orderly</Title>
        <Tagline>An intuitive wait management system</Tagline>
      </Logo>
      <AuthButtons />
    </Container>
  );
};

export default Login;

const Container = styled.div`
  display: flex;
  height: 100vh;
  background: linear-gradient(174.67deg, #f19164 4.27%, #ce6838 99.46%);
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  gap: 30px;
`;

const Title = styled.h1`
  color: white;
  margin-bottom: -12px;
`;

const Tagline = styled.h2`
  color: white;
  text-align: center;
  font-size: 14pt;
  width: 60%;
  font-weight: 400;
`;

const ItemImg = styled.img`
  width: 100px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  margin-top: auto;
`;
