import * as React from "react";
import { Tabs, Tab } from "baseui/tabs-motion";
import { Heading, HeadingLevel } from "baseui/heading";
import { ParagraphSmall, ParagraphXSmall } from "baseui/typography";
import styled from "styled-components";
import MenuItem from "./MenuItem";
import { useParams } from "react-router-dom";
import { fetchRequest } from "../../helper/fetchRequest";
import { AppContext } from "../../context/AppContext";

export default function CategoryTabs() {
  const [activeKey, setActiveKey] = React.useState<React.Key>(0);
  const [categories, setCategories] = React.useState([]);
  const [itemIds, setItemIds] = React.useState([]);

  const { orgId } = useParams();
  const { isFilterOn, priceRange, prepareTimeRange, isVegetarian, isVegan } =
    React.useContext(AppContext);

  React.useEffect(() => {
    const fecthCategories = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/menu/categories/${orgId}`
        );
        const data = await res.json();
        const categoryNames = data.output;
        setCategories(categoryNames);
      } catch (err) {
        console.log(err);
      }
    };

    fecthCategories();
  }, []);

  React.useEffect(() => {
    const fetchItemIds = async () => {
      if (categories !== null) {
        try {
          const res = await fetch(
            `http://localhost:3001/menu/${
              categories[Number(activeKey)]
            }/${orgId}`
          );
          const data = await res.json();
          if (!data.output) return;
          // setItemIds(data.output);
          // get all item details
          Promise.all(
            data.output.map(async (itemId: string) => {
              const [data, err] = await fetchRequest(
                `http://localhost:3001/menu/item/${itemId}`,
                "get",
                null
              );
              return data;
            })
          ).then((resp) => {
            const filteredItems = resp.filter((item: any) =>
              checkItemFilter(
                item,
                priceRange,
                prepareTimeRange,
                isVegan,
                isVegetarian
              )
            );
            const filteredIds = filteredItems.map(
              (item: any) => item.item_id
            ) as any;
            setItemIds(filteredIds);
          });
        } catch (err) {
          console.log(err);
        }
      }
    };
    fetchItemIds();
  }, [
    categories,
    activeKey,
    priceRange,
    prepareTimeRange,
    isVegan,
    isVegetarian,
  ]);

  return (
    <Tabs
      activeKey={activeKey}
      onChange={({ activeKey }) => setActiveKey(activeKey)}
      overrides={{
        TabBorder: {
          style: {
            marginBottom: "-15px",
          },
        },
      }}
    >
      {categories.map((category) => (
        <Tab title={category}>
          <HeadingLevel>
            <Heading styleLevel={4}>{category}</Heading>
            <ItemsCont>
              {itemIds !== null &&
                itemIds.map((itemId) => (
                  <MenuItem key={itemId} itemId={itemId} />
                ))}
            </ItemsCont>
          </HeadingLevel>
        </Tab>
      ))}
    </Tabs>
  );
}

export const ItemsCont = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const checkItemFilter = (
  data: any,
  priceRange: any,
  prepareTimeRange: any,
  isVegan: any,
  isVegetarian: any
) => {
  const dietTypes = data.dietType;
  const price = parseInt(data.price);
  const prepTime = parseInt(data.prepTime);
  // check whether in the price range
  if (price >= priceRange[0] && price <= priceRange[1]) {
    // check whether in the preparation time range
    if (prepTime >= prepareTimeRange[0] && prepTime <= prepareTimeRange[1]) {
      // check if there any type checked
      if (isVegan || isVegetarian) {
        for (const type of dietTypes) {
          if (type === "VG" && isVegan) {
            return true;
          } else if (type === "V" && isVegetarian) {
            return true;
          }
        }
        // no type checked, it should display in the menu
      } else {
        return true;
      }
    }
  }
  return false;
};
