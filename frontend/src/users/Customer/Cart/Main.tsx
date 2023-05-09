import { Button, SHAPE } from "baseui/button";
import { Heading, HeadingLevel } from "baseui/heading";
import React, { useContext, useState } from "react";
import styled from "styled-components";
import { AppContext } from "../../../context/AppContext";
import Fade from "../../../components/Fade";
import Count from "../../../components/menu/itemDetails/Count";
import { TitleCont } from "../../../components/styles";
import { CustSelections } from "../../../components/menu/itemDetails/ItemDetails";
import { Item } from "framer-motion/types/components/Reorder/Item";
import { fetchRequest } from "../../../helper/fetchRequest";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { Spinner } from "../../../components/queue/Main";
import { toast } from "react-hot-toast";
import EmptyCart from "../../../images/emptyCart.svg";
import { EmptyWrapper } from "../../../components/Reviews/Main";

type Props = {};

interface CartItemProps {
  qty: number;
  customisations: CustSelections;
  img: any;
  price: number;
  item_id: string;
  title: string;
  status: string;
}

const ENDPOINT = "http://localhost:3001/";
let socket: Socket;

const Cart = (props: Props) => {
  const { cartItems, setCartItems } = useContext(AppContext);

  const [checkoutSum, setCheckoutSum] = React.useState(0);
  const [isSending, setIsSending] = React.useState(false);

  const updatePrice = (diff: number, ind: number) => {
    if (diff === -1 && cartItems[ind].qty === 1) {
      // const ktempItems = [...cartItems];
      const tempItems = cartItems.filter((item: any, i: number) => ind !== i);
      setCartItems(tempItems);
    } else {
      const updatedCartItems = cartItems.map(
        (item: CartItemProps, i: number) => {
          if (i === ind) return { ...item, qty: item.qty + diff };
          else return item;
        }
      );
      setCartItems(updatedCartItems);
    }
  };

  React.useEffect(() => {
    const total = cartItems.reduce(
      (acc: number, item: CartItemProps) => acc + item.price * item.qty,
      0
    );
    setCheckoutSum(total);
  }, [cartItems]);

  const { orgId, tableId } = useParams();
  React.useEffect(() => {
    socket = io(ENDPOINT);

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendOrder = async () => {
    const cartItemsWithoutImgs = cartItems.map(
      ({ img, ...otherProps }: { img: any }) => otherProps
    );
    //console.log(`items: ${cartItems}`);
    const orderDetails = {
      restaurantId: orgId,
      tableNum: tableId,
      totalPrice: checkoutSum,
      items: cartItemsWithoutImgs,
      orgId: orgId,
    };

    socket.emit("create_order", orderDetails);
    toast.success("Your order has been placed!");

    setCartItems([]);
    // setBtnMsg(<Spinner />);
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      // setCartItems([]);
    }, 500);
  };
  console.log(cartItems);

  const navigate = useNavigate();

  return (
    <Fade>
      <Cont>
        <HeadingLevel>
          <TitleCont>
            <Heading styleLevel={3} marginBottom="10px">
              Cart
            </Heading>
          </TitleCont>
        </HeadingLevel>
        {cartItems.length === 0 ? (
          <EmptyWrapper initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <img src={EmptyCart} width="100%" />
            <div>Your cart is empty!</div>
          </EmptyWrapper>
        ) : (
          <CartItems>
            {cartItems.map((item: CartItemProps, ind: number) => (
              <CartItemWrapper>
                <ItemImg
                  src={item.img}
                  onClick={() =>
                    navigate(
                      `/restaurant/${orgId}/table/${tableId}/menu/${item.item_id}`
                    )
                  }
                />
                <ItemInfo>
                  <div>
                    <ItemTitle>{item.title}</ItemTitle>
                    <Selections>
                      {Object.values(item.customisations).map(
                        (selection: any) => (
                          // <>{item[0].title} · </>
                          <>
                            {selection.map((item: any) => (
                              <>{item.title} · </>
                            ))}
                          </>
                        )
                      )}
                    </Selections>
                  </div>

                  <ItemActionsCont>
                    <ItemPrice>${(item.price * item.qty).toFixed(2)}</ItemPrice>
                    <Count
                      qty={item.qty}
                      updatePrice={updatePrice}
                      ind={ind}
                      size="small"
                    />
                  </ItemActionsCont>
                </ItemInfo>
              </CartItemWrapper>
            ))}
          </CartItems>
        )}
        <Button
          overrides={{
            Root: {
              style: {
                width: "100%",
                marginTop: "auto",
                borderRadius: "15px",
                display: "flex",
                gap: "15px",
              },
            },
          }}
          disabled={checkoutSum === 0}
          onClick={sendOrder}
        >
          <div>
            {isSending ? (
              <SendingMsg>
                <Spinner />
                Placing Order...
              </SendingMsg>
            ) : (
              <>Place Order</>
            )}
          </div>
          {checkoutSum !== 0 && (
            <CheckoutPrice>${checkoutSum.toFixed(2)}</CheckoutPrice>
          )}
        </Button>
      </Cont>
    </Fade>
  );
};

export default Cart;

const Cont = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: calc(90vh - 60px);
`;

const CartItemWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding-bottom: 20px;
  border-bottom: 0.1em solid #c4c4c4;
`;

const ItemImg = styled.img`
  min-width: 110px;
  height: 110px;
  object-fit: cover;
  border-radius: 20px;
  cursor: pointer;
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: space-between;
  padding: 10px 0;
  height: 130px;
  box-sizing: border-box;
  width: 100%;
`;

const CartItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ItemTitle = styled.div`
  font-weight: 400;
  font-size: 14pt;
`;

const ItemActionsCont = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ItemPrice = styled.div`
  font-weight: 500;
  font-size: 13pt;
`;

const CheckoutPrice = styled.div`
  background-color: #db6d3a;
  padding: 7px 9px;
  border-radius: 15px;
`;

const Selections = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* number of lines to show */
  line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 11pt;
  color: #606060;
`;

const SendingMsg = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;
