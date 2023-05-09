import styled from "styled-components";
import { Button, SHAPE, SIZE } from "baseui/button";
import { Plus } from "baseui/icon";
import React from "react";
import { Link } from "react-router-dom";

export const TitleCont = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

interface BtnProps {
  onClick: () => void;
}

export const AddBtn: React.FC<BtnProps> = ({ onClick }) => (
  <ButtonWrapper>
    <Button
      shape={SHAPE.circle}
      size={SIZE.large}
      onClick={onClick}
      overrides={{
        Root: {
          style: {
            width: "3.5em",
            height: "3.5em",
            boxShadow: "rgb(205 132 98) 0px 5px 12px",
          },
        },
      }}
    >
      <Plus size="25px" />
    </Button>
  </ButtonWrapper>
);

export const ButtonWrapper = styled.div`
  position: absolute;
  right: 25px;
  bottom: 120px;
`;

// BREADCRUMBS
export const GreyedLink = styled(Link)`
  text-decoration: none;
  color: #474747 !important;
`;
export const CurrLink = styled.span`
  color: #848484;
`;
export const breadcrumbOverrides = {
  Root: {
    style: {
      marginBottom: "-15px",
    },
  },
};

// drag-n-drop
export const DraggableItem = styled.div`
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  background-color: white;
`;

export const DroppableCont = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 60vh;
`;

export const Divider = styled.hr`
  border: 0.05em solid #eeeeee;
`;
