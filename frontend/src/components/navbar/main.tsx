import React, { useContext } from "react";
import { Button } from "baseui/button";
import { AppNavBar, setItemActive, NavItemT } from "baseui/app-nav-bar";
import menu from "../../images/menu.svg";
import cart from "../../images/cart.svg";
import queue from "../../images/queue.svg";
import bill from "../../images/bill.svg";
import chart from "../../images/chart.svg";
import team from "../../images/team.svg";
import edit from "../../images/edit.svg";
import bell from "../../images/bell.svg";
import orders from "../../images/orders.svg";
import menuAdd from "../../images/menuAdd.svg";
import orderly from "../../images/orderlyLogo.svg";
import { Icon, IconTxt, NavItem, Wrapper } from "./styled";
import { Link, NavLink, useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import { AppContext } from "../../context/AppContext";

interface Props {
  user: string;
}

const Navbar: React.FC<Props> = ({ user }) => {
  let { pathname } = useLocation();

  let customerRoute = "";
  let navItems = customer;
  if (user === "manager") navItems = manager;
  if (user === "waiter") navItems = waiter;
  if (user === "chef") navItems = chef;
  if (user === "restaurant") {
    const paths = pathname.split("/");
    customerRoute = paths.slice(0, 5).join("/");
  }

  const [selected, setSelected] = React.useState(navItems[0].title);

  const { cartItems } = useContext(AppContext);

  return (
    <Wrapper>
      {navItems.map((item) => (
        <NavLink
          to={
            user === "restaurant"
              ? `${customerRoute}/${item.title.toLowerCase()}`
              : `/${user}/${item.title.toLowerCase()}`
          }
          key={item.title}
          style={({ isActive }) => {
            if (isActive) setSelected(item.title);
            return {
              color: isActive ? "#F19164" : "#636363",
              textDecoration: "none",
            };
          }}
        >
          <NavItem>
            <div style={{ position: "relative", marginBottom: "-5px" }}>
              {item.src === cart && cartItems.length > 0 && <CartBadge />}
              <Icon src={item.src} selected={selected === item.title} />
            </div>
            <IconTxt selected={selected === item.title}>{item.title}</IconTxt>
          </NavItem>
        </NavLink>
      ))}
    </Wrapper>
  );
};

export default Navbar;

const CartBadge = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 10px;
  height: 10px;
  background-color: #eb8a63;
  border-radius: 50%;
  z-index: 2;

  &::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: inherit;
    border-radius: 50%;
    z-index: -1;
    animation: ripple 5s ease-out infinite;
  }

  @keyframes ripple {
    0% {
      opacity: 1;
      transform: scale(0);
    }
    20% {
      opacity: 0;
      transform: scale(3);
    }

    100% {
      opacity: 0;
      transform: scale(3);
    }
  }
`;

const customer = [
  {
    src: menu,
    title: "Menu",
  },
  {
    src: cart,
    title: "Cart",
  },
  {
    src: queue,
    title: "Queue",
  },
  {
    src: bill,
    title: "Bill",
  },
];

const manager = [
  {
    src: menuAdd,
    title: "Menu",
  },
  {
    src: chart,
    title: "Statistics",
  },
  {
    src: team,
    title: "Admin",
  },
];

const waiter = [
  {
    src: queue,
    title: "Queue",
  },
  {
    src: bell,
    title: "Requests",
  },
  {
    src: orders,
    title: "Payments",
  },
];

const chef = [
  {
    src: queue,
    title: "Queue",
  },
];
