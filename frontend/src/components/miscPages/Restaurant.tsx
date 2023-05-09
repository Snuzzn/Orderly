import React, { useContext } from "react";
import { Card, StyledBody, StyledAction } from "baseui/card";
import styled from "styled-components";
import { Button, SHAPE, SIZE } from "baseui/button";
import { Heading, HeadingLevel } from "baseui/heading";
import { useRedirectFunctions, withAuthInfo } from "@propelauth/react";
import { AuthContext } from "../../context/AuthContext";
import { Plus } from "baseui/icon";
import { useNavigate } from "react-router-dom";
import { AddBtn, TitleCont } from "../styles";
import { BiUserPlus } from "react-icons/bi";
import { IconWrapper } from "../../users/Manager/MenuMod/Category/Main";
import DrawerToggleButton from "../SideDrawer/DrawerToggleButton";
import Fade from "../Fade";

const Restaurant: React.FC<any> = (props) => {
  const { uId, setUserRole, updateUserRole, setOid } = useContext(AuthContext);
  const orgs = props.orgHelper.getOrgs();
  const { redirectToCreateOrgPage, redirectToOrgPage } = useRedirectFunctions();

  let navigate = useNavigate();

  const enterRestaurant = (userRole: string, orgId: string) => {
    updateUserRole(userRole);
    if (userRole === "Manager") navigate("/manager/menu");
    else if (userRole === "Waiter") navigate("/waiter/queue");
    else if (userRole === "Chef") navigate("/chef/queue");
    setOid(orgId);
    localStorage.setItem("oId", orgId);
  };

  orgs.sort((a: any, b: any) => {
    if (a.userRoleName < b.userRoleName) return -1;
    else if (a.userRoleName === b.userRoleName) return 0;
    else return 1;
  });

  return (
    <Fade>
      <Cont>
        <HeadingLevel>
          <TitleCont>
            <Heading styleLevel={3}>Your Restaurants</Heading>
            <DrawerToggleButton />
            <div style={{ position: "absolute", bottom: "-75px", right: "0" }}>
              <AddBtn onClick={redirectToCreateOrgPage} />
            </div>
          </TitleCont>
        </HeadingLevel>
        {orgs.map((org: any) => (
          <CardWrapper
            key={org.orgId}
            onClick={() => enterRestaurant(org.userRoleName, org.orgId)}
          >
            <Card title={org.orgName}>
              <StyledBody>{org.userRoleName}</StyledBody>
              <ButtonCont>
                {/* <Button
                onClick={() => enterRestaurant(org.userRoleName, org.orgId)}
              >
                Enter Restaurant
              </Button> */}
              </ButtonCont>
              <Button
                onClick={(e: any) => {
                  e.stopPropagation();
                  redirectToOrgPage(org.orgId);
                }}
              >
                <BiUserPlus size="1.2em" />
                &nbsp; Invite Staff
              </Button>
            </Card>
          </CardWrapper>
        ))}
      </Cont>
    </Fade>
  );
};

const Cont = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
`;

export default withAuthInfo(Restaurant);

const ButtonCont = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const CardWrapper = styled.div`
  cursor: pointer;
`;
