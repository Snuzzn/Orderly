import React from "react";
import { Input, SIZE } from "baseui/input";
import { Search } from "baseui/icon";
import styled from "styled-components";
import Filters from "./Filter/Filters";
import { fetchRequest } from "../../helper/fetchRequest";
import { useParams } from "react-router-dom";
import ModalTemplate from "../ModalTemplate";
import { ModalBody, ModalHeader } from "baseui/modal";
import MenuItem from "../menu/MenuItem";
import { ItemsCont } from "./CategoryTabs";

export default function SearchBar() {
  const { orgId } = useParams();

  const [query, setQuery] = React.useState("");

  const [items, setItems] = React.useState([]);

  const handleSearch = async (e: any) => {
    if (e.code === "Enter") {
      const [data, err] = await fetchRequest(
        `http://localhost:3001/search/${orgId}/${query}`,
        "get",
        null
      );
      setItems(data.output);
      setIsOpen(true);

      // Promise.all(
      //   data.output.map(async (itemId: number) => {
      //     const [data, err] = await fetchRequest(
      //       `http://localhost:3001/menu/item/${itemId}`,
      //       "get",
      //       null
      //     );
      //     return data;
      //   })
      // ).then((output: any) => setItems(output));
    }
  };

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Wrapper>
      <Input
        startEnhancer={<Search size="20px" />}
        value={query}
        onChange={(e: any) => setQuery(e.target?.value)}
        placeholder="Search for a dish or drink..."
        overrides={{
          Root: {
            style: {
              borderRadius: "30px",
            },
          },
        }}
        clearOnEscape
        onKeyDown={(e) => handleSearch(e)}
      />
      <div style={{ flex: "1" }} />
      <Filters />
      <ModalTemplate isOpen={isOpen} setIsOpen={setIsOpen}>
        <ModalHeader>Search Results</ModalHeader>
        <ModalBody>
          <ItemsCont>
            {items.map((itemId) => (
              <MenuItem itemId={itemId} />
            ))}
          </ItemsCont>
        </ModalBody>
      </ModalTemplate>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 15px;
`;
