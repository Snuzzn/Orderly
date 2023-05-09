import { Checkbox } from "baseui/checkbox";
import { StatefulTooltip, TRIGGER_TYPE } from "baseui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { AiOutlineCheckCircle, AiOutlineDollarCircle } from "react-icons/ai";
import styled from "styled-components";
import { Spinner } from "../../../components/queue/Main";
import { FadingIcon, renderIcon } from "../Queue/Main";

const PaymentItem = ({
  isOwnBill,
  item,
  selectedPrice,
  setSelectedPrice,
  selectedItems,
  setSelectedItems,
}) => {
  const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    checked
      ? setSelectedItems([...selectedItems, item])
      : setSelectedItems(() =>
          selectedItems.filter((itemT) => item.itemId !== itemT.itemId)
        );
  }, [checked]);

  React.useEffect(() => {
    let price = 0;
    for (const selectItem of selectedItems) {
      price += selectItem.qty * selectItem.price;
    }
    setSelectedPrice(price);
  }, [selectedItems]);

  return (
    <ul style={{ display: "flex", alignItems: "center" }}>
      {isOwnBill && (
        <motion.li
          className="checkbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          layout
        >
          <Checkbox
            checked={checked}
            disabled={item.status === "Awaiting payment"}
            onChange={(e) => {
              setChecked(!checked);
            }}
          ></Checkbox>
        </motion.li>
      )}

      <motion.li
        layout
        className="item-description"
        style={item.status === "Awaiting payment" && greyedOut}
      >
        {item.title}
      </motion.li>
      <motion.li layout className="space"></motion.li>

      <div
        style={{
          display: "flex",
          gap: "20px",
          minWidth: "170px",
          justifyContent: "space-between",
        }}
      >
        <motion.li layout style={{ justifyContent: "flex-start" }}>
          <Cell layout>{renderStatus(item.status)}</Cell>
        </motion.li>

        <motion.li
          layout
          className="item-quantity"
          style={item.status === "Awaiting payment" && greyedOut}
        >
          {item.qty}
        </motion.li>
        <Cell
          layout
          className="item-price"
          style={item.status === "Awaiting payment" && greyedOut}
        >
          {item.price.toFixed(2)}
        </Cell>
      </div>
    </ul>
  );
};

const renderStatus = (status) => {
  if (status === "Preparing" || status === "On it's way")
    return (
      <StatefulTooltip
        content={"Not yet served..."}
        triggerType={TRIGGER_TYPE.click}
        returnFocus
        autoFocus
      >
        <div>
          <Spinner />
        </div>
      </StatefulTooltip>
    );
  else if (status === "Served")
    return (
      <StatefulTooltip content={"Served"} triggerType={TRIGGER_TYPE.click}>
        <div>
          <AiOutlineCheckCircle size="28px" color="#686868" />
        </div>
      </StatefulTooltip>
    );
  else if (status === "Awaiting payment")
    return (
      <StatefulTooltip
        content={"Awaiting payment"}
        triggerType={TRIGGER_TYPE.click}
      >
        <FadingIcon>
          <AiOutlineDollarCircle size="28px" color="#686868" />
        </FadingIcon>
      </StatefulTooltip>
    );
  else if (status === "Paid")
    return <AiOutlineDollarCircle size="28px" color="green" />;
};

export default PaymentItem;

const greyedOut = {
  textDecoration: "line-through",
  color: "grey",
};

const Cell = styled(motion.div)`
  margin-right: 13px;
  &:last-child {
    margin-right: 4px;
  }
`;
