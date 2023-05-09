import React from "react";
import { Drawer } from "baseui/drawer";
import "./DrawerToggleButton.css";
import Login from "../auth/Login";
import { GrMenu } from "react-icons/gr";

const DrawerToggleButton = (props) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Drawer
        isOpen={isOpen}
        autoFocus
        onClose={() => setIsOpen(false)}
        overrides={{
          Close: {
            style: closeStyles,
          },
        }}
      >
        <div
          style={{ width: "100%", position: "absolute", top: "0", left: "0" }}
        >
          <Login />
        </div>
      </Drawer>
      <GrMenu
        size="1.7em"
        onClick={() => setIsOpen(true)}
        style={{ cursor: "pointer" }}
      />
    </>
  );
};

export default DrawerToggleButton;

const closeStyles = {
  color: "white",
  background: "white",
  borderRadius: "10px",
};
