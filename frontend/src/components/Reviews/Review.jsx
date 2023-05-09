import React from "react";
import styled from "styled-components";
import { StarRating } from "baseui/rating";
import Fade from "../Fade";

const Review = ({ review }) => {
  let rate = parseInt(review.rating);
  //console.log(rate);

  return (
    <Fade>
      <Wrapper>
        <div style={{ "font-weight": "bold" }}>{review.name}</div>
        <StarRating numItems={5} size={22} value={rate} readOnly />
        <div>{review.description}</div>
      </Wrapper>
    </Fade>
  );
};

export default Review;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  background-color: #f6f8fa;
  color: black;
  align-items: left;
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
`;
