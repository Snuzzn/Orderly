import React, { useContext } from "react";
import { Checkbox, LABEL_PLACEMENT } from "baseui/checkbox";
import styled from "styled-components";
import { Slider } from "baseui/slider";
import { Button } from "baseui/button";
import { AppContext } from "../../../context/AppContext";

const FilterOptions = ({ isPopOver, setIsPopOver }) => {
  const {
    priceRange,
    setPriceRange,
    prepareTimeRange,
    setPrepareTimeRange,
    isVegetarian,
    setIsVegetarian,
    isVegan,
    setIsVegan,
  } = useContext(AppContext);

  return (
    <Wrapper>
      <Title>Dietary Requirement</Title>
      <Checkbox
        checked={isVegetarian}
        onChange={(e) => setIsVegetarian(e.target.checked)}
        labelPlacement={LABEL_PLACEMENT.right}
      >
        Vegetarian
      </Checkbox>
      <Checkbox
        checked={isVegan}
        onChange={(e) => setIsVegan(e.target.checked)}
        labelPlacement={LABEL_PLACEMENT.right}
      >
        Vegan
      </Checkbox>
      <Title>Price Range ($)</Title>
      <Slider
        max={80}
        value={priceRange}
        onChange={({ value }) => value && setPriceRange(value)}
      />
      <Title>Preparation Time Range (mins)</Title>
      <Slider
        max={60}
        value={prepareTimeRange}
        onChange={({ value }) => value && setPrepareTimeRange(value)}
      />
    </Wrapper>
  );
};

export default FilterOptions;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 70vw;
  margin-left: 1rem;
  margin-right: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const Title = styled.p`
  font-size: 14pt;
  font-weight: 500;
  margin-bottom: 10px;
`;
