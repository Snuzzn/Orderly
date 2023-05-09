import React, { useContext } from "react";
import { ItemDetailsProps } from "../MenuItem";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { ArrowLeft } from "baseui/icon";
import { Button, SHAPE, KIND } from "baseui/button";
import { HeadingLevel } from "baseui/heading";
import {
  HeadingLarge,
  HeadingMedium,
  ParagraphLarge,
  ParagraphMedium,
} from "baseui/typography";
import cart from "../../images/cart.svg";
import { Divider, TitleCont } from "../../styles";
import { FormControl } from "baseui/form-control";
import { RadioGroup, Radio, ALIGN } from "baseui/radio";
import { Tag, VARIANT } from "baseui/tag";
import { AiFillStar, AiOutlineClockCircle } from "react-icons/ai";
import { StatefulCheckbox } from "baseui/checkbox";
import Customisation, { Title } from "./Customisation";
import { Input } from "baseui/input";
import { Textarea } from "baseui/textarea";
import Count from "./Count";
import { BsCart2 } from "react-icons/bs";
import { AppContext } from "../../../context/AppContext";
import { motion } from "framer-motion";
import { Skeleton } from "baseui/skeleton";
import { AuthContext } from "../../../context/AuthContext";
import { toast } from "react-hot-toast";

interface LocationState {
  itemDetails: ItemDetailsProps;
}

export interface Option {
  title: string;
  price: number;
}

export interface CustSelections {
  [key: string]: Option[];
}

interface Selections {
  [key: string]: number;
}

const ItemDetails = () => {
  const [item, setItem] = React.useState<any>(null);

  const { itemId } = useParams();
  const { accessToken } = useContext(AuthContext);

  const location = useLocation();
  let newRoute = `${location.pathname}/reviews`;
  const [avgRating, setAvgRating] = React.useState<number | string>(0);

  const calculateAvgRating = (reviews: any) => {
    if (!reviews || reviews.length === 0) return "-";
    const total = reviews.reduce(
      (acc: number, review: any) => (acc += review.rating),
      0
    );
    const average = total / reviews.length;

    return average.toFixed(2);
  };

  React.useEffect(() => {
    // const url = `http://localhost:3000/mockData/itemDetails-${itemId}.json`;
    const url = `http://localhost:3001/menu/item/${itemId}`;
    const fetchItemDetails = async () => {
      try {
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await res.json();
        setTotalPrice(Number(data.price));
        setAvgRating(calculateAvgRating(data.reviews));
        setTimeout(() => {
          setItem(data);
        }, 400);
      } catch (err) {
        console.log(err);
      }
    };

    fetchItemDetails();
  }, []);

  // const location = useLocation();
  // const state = location.state as LocationState;

  const navigate = useNavigate();

  const [selections, setSelections] = React.useState<Selections>({});
  const [selectionsPrice, setSelectionsPrice] = React.useState(0);
  const emptyCust = {} as CustSelections;
  const [custSelections, setCustSelections] =
    React.useState<CustSelections>(emptyCust);

  const updateSelections = (
    op: string,
    title: string,
    price: number,
    customisationTitle: string
  ) => {
    // update customer selections for adding to cart
    let custSelectionsCpy: CustSelections = JSON.parse(
      JSON.stringify(custSelections)
    );
    if (!(customisationTitle in custSelectionsCpy))
      custSelectionsCpy[customisationTitle] = [];
    if (op === "add")
      custSelectionsCpy[customisationTitle].push({
        title: title,
        price: price,
      });
    if (op === "remove") {
      const custList = custSelectionsCpy[customisationTitle].filter(
        (cust) => cust.title !== title
      );
      custSelectionsCpy[customisationTitle] = custList;
    }

    setCustSelections(custSelectionsCpy);

    // update price of selections and total price
    const newSelections = { ...selections };
    if (op === "add") newSelections[title] = price;
    else delete newSelections[title];
    setSelections(newSelections);
    let newSelPrice = 0;
    for (const option in newSelections) {
      newSelPrice += Number(newSelections[option]);
    }
    setSelectionsPrice(newSelPrice);
    setTotalPrice((Number(item.price) + newSelPrice) * qty);
  };

  const [totalPrice, setTotalPrice] = React.useState(0);
  const [qty, setQty] = React.useState(1);

  const updatePriceBasedOnQty = (diff: number, ind?: any) => {
    if (qty + diff < 1) return;
    setQty(qty + diff);
    setTotalPrice((qty + diff) * (Number(item.price) + selectionsPrice));
  };

  const { setCartItems, cartItems } = useContext(AppContext);

  const addToCart = () => {
    for (const element of item.customisations) {
      if (element.required) {
        if (
          !custSelections[element.title] ||
          custSelections[element.title].length === 0
        ) {
          console.log(custSelections);
          toast.error(`'${element.title}' is a required customisaton`, {
            duration: 2000,
          });
          return;
        }
      }
    }

    const cartItem = {
      qty: qty,
      customisations: custSelections,
      price: Number(item.price) + selectionsPrice,
      item_id: itemId,
      title: item.title,
      img: item.img,
      status: "Preparing",
    };
    setCartItems([...cartItems, cartItem]);
    toast.success(`Added '${item.title}' to cart!`, {
      icon: "🛒",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ ease: "easeOut", duration: 0.15 }}
      exit={{ opacity: 0, x: 100 }}
    >
      {item ? (
        <>
          <Button
            shape={SHAPE.circle}
            overrides={{
              Root: {
                style: {
                  position: "fixed",
                  top: "10px",
                  left: "10px",
                  zIndex: "100",
                },
              },
            }}
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size="1.5em" />
          </Button>

          <Shade />
          <div style={{ position: "relative" }}>
            <ImgCont>
              <ItemImg
                src={
                  item.img ||
                  "https://wolper.com.au/wp-content/uploads/2017/10/image-placeholder.jpg"
                }
              />

              <PrepTime>
                <AiOutlineClockCircle /> ~{item.prepTime} mins
              </PrepTime>
              <Link to={newRoute}>
                <Rating>
                  <AiFillStar /> {avgRating}
                </Rating>
              </Link>
            </ImgCont>
            <BgImg
              style={{}}
              src={
                item.img ||
                "https://wolper.com.au/wp-content/uploads/2017/10/image-placeholder.jpg"
              }
            />
          </div>

          <HeadingLevel>
            <HeadingMedium marginBottom="scale500">{item.title}</HeadingMedium>
          </HeadingLevel>
          <ParagraphMedium>{item.description}</ParagraphMedium>
          <Divider />
          <CustomisationsCont>
            {item.customisations.map((customisation: any, index: number) => (
              <Customisation
                key={index}
                customisation={customisation}
                update={updateSelections}
              />
            ))}
          </CustomisationsCont>
          <TitleCont>
            <Count updatePrice={updatePriceBasedOnQty} qty={qty} size="large" />
            <HeadingMedium>${totalPrice.toFixed(2)}</HeadingMedium>
          </TitleCont>
          <Button
            startEnhancer={() => <BsCart2 size="1.2em" />}
            overrides={{ Root: { style: { width: "100%", color: "black" } } }}
            shape={SHAPE.pill}
            onClick={() => addToCart()}
            kind={KIND.secondary}
            disabled={location.pathname.includes("manager")}
          >
            Add to Cart
          </Button>
        </>
      ) : (
        <SkeletonCont>
          <Skeleton animation height="300px" width="100%" />
          <Skeleton animation height="70px" width="100%" />
          <Skeleton animation height="90px" width="100%" />
          <Skeleton animation height="250px" width="100%" />
        </SkeletonCont>
      )}
    </motion.div>
  );
};

export default ItemDetails;

const ItemImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const BgImg = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  filter: blur(100px) brightness(1.5);
  width: 100%;
  height: 500px;
  object-fit: fill;
  z-index: -100;
  @media (max-width: 768px) {
    display: none;
  }
`;

const ImgCont = styled.div`
  margin: -20px;
  overflow: hidden;
  height: 300px;
  position: relative;
  @media (min-width: 768px) {
    height: 500px;
    width: clamp(800px, 50vw, 1000px);
    margin: auto auto;
  }
`;

const CustomisationsTitle = styled.div`
  background-color: #fbe2d6;
  color: #db6d38;
  padding: 10px 34px;
  border-radius: 50px;
  align-self: center;
`;

const CustomisationsCont = styled.div`
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  width: 100%;
  font-weight: bold;
  gap: 20px;
`;

const PrepTime = styled.div`
  background-color: #f19164;
  color: white;
  position: absolute;
  padding: 7px;
  border-radius: 10px;
  bottom: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Shade = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 5px;
  background-color: #212121;
  box-shadow: 0 0 30px 40px #212121;
  z-index: 99;
  opacity: 0.2;
`;

const Rating = styled.div`
  cursor: pointer;
  background-color: white;
  border-radius: 20px;
  font-size: 16pt;
  font-weight: bold;
  padding: 10px 15px;
  position: absolute;
  bottom: 10px;
  left: 10px;
  color: #ff7b2b;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SkeletonCont = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
