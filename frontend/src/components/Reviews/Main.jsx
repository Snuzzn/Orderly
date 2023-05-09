import React, { useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import Review from "./Review";
import { Heading, HeadingLevel } from "baseui/heading";
import { AddBtn, TitleCont } from "../styles";
import { Button, SHAPE } from "baseui/button";
import { ArrowLeft, Plus } from "baseui/icon";
import styled from "styled-components";
import { fetchRequest } from "../../helper/fetchRequest";
import ChefHoldingBowl from "../../images/ChefHoldingBowl.svg";
import { Skeleton } from "baseui/skeleton";
import { motion } from "framer-motion";

const Reviews = () => {
  const [reviews, setReviews] = React.useState([]);

  const { itemId, orgId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  let newRoute = `${location.pathname}/add`;

  useEffect(() => {
    const getReviews = async () => {
      const [data, err] = await fetchRequest(
        `http://localhost:3001/menu/item/${itemId}`,
        "get",
        null
      );
      setReviews(data.reviews || []);
      setIsLoading(false);
    };

    getReviews();
  }, []);

  const [isLoading, setIsLoading] = React.useState(true);

  return (
    <>
      <Container>
        <Button
          shape={SHAPE.circle}
          overrides={{
            Root: {
              style: {
                zIndex: "100",
              },
            },
          }}
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size="1.5em" />
        </Button>

        <HeadingLevel>
          <TitleCont>
            <Heading styleLevel={3}>Reviews</Heading>
          </TitleCont>
        </HeadingLevel>
        <div style={{ flex: "1" }}></div>
        {!location.pathname.includes("manager") && (
          <Link to={newRoute}>
            <AddBtn />
          </Link>
        )}
      </Container>
      <ReviewCont>
        {!isLoading ? (
          <>
            {reviews.map((item) => (
              <Review review={item} />
            ))}
          </>
        ) : (
          <>
            {[...Array(5).keys()].map((item) => (
              <Skeleton height="125px" width="100%" animation />
            ))}
          </>
        )}
      </ReviewCont>
      {reviews.length === 0 && !isLoading && (
        <EmptyWrapper initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <NoReviewsImg src={ChefHoldingBowl} alt="" />
          <div>No Reviews Yet!</div>
        </EmptyWrapper>
      )}
    </>
  );
};

export default Reviews;

const Container = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const ReviewCont = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const NoReviewsImg = styled.img`
  width: clamp(400px, 60%, 700px);
  height: clamp(400px, 60% 700px);
`;

export const EmptyWrapper = styled(motion.div)`
  margin: auto auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
`;
