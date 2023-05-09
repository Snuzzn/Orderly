import { ParagraphSmall, ParagraphXSmall } from "baseui/typography";
import React, { FC, useContext } from "react";
import styled from "styled-components";
import Bowl from "../../images/veggie-bowl.png";
import { Skeleton } from "baseui/skeleton";
import { StatefulTooltip, TRIGGER_TYPE } from "baseui/tooltip";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { showToast } from "../../helper/toast";
import orderlyLogo from "../../images/orderlyLogo.svg";
import { AppContext } from "../../context/AppContext";

interface Props {
  itemId: string;
}

export interface ItemDetailsProps {
  id: string;
  title: string;
  price: number;
  description: string;
  prepTime: number;
  dietType: Array<string>;
  customisations: any;
  img: any;
}

const MenuItem: FC<Props> = ({ itemId }) => {
  const [itemDetails, setItemDetails] = React.useState<null | ItemDetailsProps>(
    null
  );

  const navigate = useNavigate();

  const { accessToken } = useContext(AuthContext);
  const { priceRange, prepareTimeRange, isVegetarian, isVegan } =
    useContext(AppContext);

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
        if (data)
          setTimeout(() => {
            setItemDetails(data);
          }, 200);
        else toast.error("Could not fetch item info");
      } catch (err) {
        console.log(err);
      }
    };

    fetchItemDetails();
  }, [priceRange, prepareTimeRange, isVegetarian, isVegan]);

  return (
    <>
      {!itemDetails ? (
        <Skeleton width="100%" height="125px" animation />
      ) : (
        <Wrapper
          onClick={() =>
            navigate(`${itemId}`, {
              state: { itemDetails: itemDetails },
            })
          }
        >
          <ItemImg
            src={
              itemDetails.img ||
              "https://wolper.com.au/wp-content/uploads/2017/10/image-placeholder.jpg"
            }
            alt=""
          />
          <BriefDetails>
            <ParagraphSmall
              overrides={{
                Block: {
                  style: {
                    margin: "0 0 4px 0",
                    fontSize: "12.5pt",
                  },
                },
              }}
            >
              {itemDetails.title}
            </ParagraphSmall>
            <PriceAndType>
              <div
                style={{
                  fontSize: "11pt",
                }}
              >
                ${Number(itemDetails.price).toFixed(2)}
              </div>
              {itemDetails.dietType.map((diet: string) => (
                <StatefulTooltip
                  content={() => {
                    if (diet === "VG") return "Vegan";
                    if (diet === "V") return "Vegetarian";
                    else return "None";
                  }}
                  triggerType={TRIGGER_TYPE.hover}
                  returnFocus
                  autoFocus
                  key={diet}
                >
                  <DietType>
                    <b>{diet}</b>
                  </DietType>
                </StatefulTooltip>
              ))}
            </PriceAndType>
            <ParagraphXSmall
              overrides={{
                Block: {
                  style: {
                    margin: "5px 0 0 0 0",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    "-webkit-line-clamp": 2,
                    "-webkit-box-orient": "vertical",
                  },
                },
              }}
            >
              {itemDetails.description}
            </ParagraphXSmall>
          </BriefDetails>
        </Wrapper>
      )}
    </>
  );
};

export default MenuItem;

const Wrapper = styled.div`
  display: flex;
  gap: 20px;
  cursor: pointer;
`;

const BriefDetails = styled.div`
  display: flex;
  flex-direction: column;
  height: 125px;
  align-self: center;
`;

const DietType = styled.span`
  background-color: #f19164;
  color: white;
  padding: 6px;
  height: 6px;
  width: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 6pt;
`;

const PriceAndType = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ItemImg = styled.img`
  min-width: 125px;
  max-width: 125px;
  height: 125px;
  object-fit: cover;
  border-radius: 20px;
`;
