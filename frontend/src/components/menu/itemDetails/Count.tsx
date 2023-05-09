import { Button, KIND, SHAPE, SIZE } from "baseui/button";
import React from "react";
import { ButtonGroup } from "baseui/button-group";
import styled from "styled-components";

type Props = {
  updatePrice: any;
  qty: number;
  ind?: number;
  size: string;
};

const Count = (props: Props) => {
  const { updatePrice, qty, ind, size } = props;
  return (
    <CountCont>
      <Button
        shape={SHAPE.circle}
        kind={KIND.secondary}
        size={size === "small" ? SIZE.compact : SIZE.default}
        overrides={btnOverrides}
        onClick={() => updatePrice(-1, ind)}
      >
        -
      </Button>
      <div>{qty}</div>
      <Button
        shape={SHAPE.circle}
        size={size === "small" ? SIZE.compact : SIZE.default}
        kind={KIND.secondary}
        overrides={btnOverrides}
        onClick={() => updatePrice(1, ind)}
      >
        +
      </Button>
    </CountCont>
  );
};

export default Count;

const CountCont = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const btnOverrides = {
  Root: {
    style: {
      color: "black",
    },
  },
};
