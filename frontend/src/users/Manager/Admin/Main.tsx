import { useRedirectFunctions } from "@propelauth/react";
import { Button } from "baseui/button";
import { Heading, HeadingLevel } from "baseui/heading";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import DrawerToggleButton from "../../../components/SideDrawer/DrawerToggleButton";
import { TitleCont } from "../../../components/styles";
import { AuthContext } from "../../../context/AuthContext";

const Setup = () => {
  const navigate = useNavigate();
  const { redirectToOrgPage } = useRedirectFunctions();
  const { oId } = useContext(AuthContext);

  return (
    <HeadingLevel>
      <TitleCont>
        <Heading styleLevel={4}>Admin</Heading>
        <DrawerToggleButton />
      </TitleCont>

      <ButtonCont>
        <Button onClick={() => navigate("qr")}>Prepare QR Codes</Button>
        <Button onClick={() => redirectToOrgPage(oId)}>Manage Staff</Button>
      </ButtonCont>
    </HeadingLevel>
  );
};

export default Setup;

const ButtonCont = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
