import React, { useContext } from "react";
import { StatefulPopover, PLACEMENT } from "baseui/popover";
import { Input } from "baseui/input";
import { Button } from "baseui/button";
import { Block } from "baseui/block";
import Filter from "baseui/icon/filter";
import FilterOptions from "./FilterOptions";
import { AppContext } from "../../../context/AppContext";

const Filters = () => {
  // useStates
  const [isPopOver, setIsPopOver] = React.useState(false);
  // const { setIsFilterOn } = useContext(AppContext);
  // React.useEffect(() => {
  //   if (isPopOver) setIsFilterOn(true);
  // }, [isPopOver]);

  return (
    <StatefulPopover
      overrides={{
        Body: {
          style: {
            backgroundColor: "white",
            borderRadius: "15px",
            zIndex: "3",
          },
        },
        Inner: { style: { backgroundColor: "white" } },
      }}
      placement={PLACEMENT.bottomRight}
      content={() => (
        <FilterOptions isPopOver={isPopOver} setIsPopOver={setIsPopOver} />
      )}
    >
      <button
        style={{
          "background-color": "white",
          border: "white",
          cursor: "pointer",
          color: "#eb7347",
        }}
      >
        <Filter size={40} />
      </button>
    </StatefulPopover>
  );
};

export default Filters;
