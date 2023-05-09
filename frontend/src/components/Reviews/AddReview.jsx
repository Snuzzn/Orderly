import React from "react";
import { StarRating } from "baseui/rating";
import { Heading, HeadingLevel } from "baseui/heading";
import { TitleCont } from "../styles";
import styled from "styled-components";
import { Input, SIZE } from "baseui/input";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Button, SHAPE } from "baseui/button";
import { ArrowLeft } from "baseui/icon";
import Fade from "../Fade";
import { Textarea } from "baseui/textarea";
import { fetchRequest } from "../../helper/fetchRequest";
import toast from "react-hot-toast";

const AddReview = () => {
  const [name, setName] = React.useState("");
  const [rating, setRating] = React.useState(0);
  const [description, setDescription] = React.useState("");

  const { orgId, itemId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleAddReview = async () => {
    if (description === "") {
      toast.error("Please enter a description");
      return;
    }
    setIsLoading(true);
    const [data, err] = await fetchRequest(
      `http://localhost:3001/reviews/${orgId}`,
      "post",
      {
        item_id: itemId,
        name: name === "" ? "Anonymous" : name,
        description: description,
        rating: rating,
      }
    );
    setTimeout(() => {
      setIsLoading(false);
      navigate(-1);
      toast.success("Succesfully added review!");
    }, 700);
  };

  return (
    <Fade>
      <Wrapper>
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
              <Heading styleLevel={3}>Add Review</Heading>
            </TitleCont>
          </HeadingLevel>
        </Container>

        <Title>Name</Title>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Please enter your name"
          clearable
        />
        <Title>Review</Title>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Please enter your review here"
          clearable
          // size={SIZE.large}
        />
        <Title>Rating</Title>
        <StarRating
          numItems={5}
          onChange={(data) => setRating(data.value)}
          size={22}
          value={rating}
        />

        <Button
          onClick={handleAddReview}
          style={{ marginTop: "auto" }}
          disabled={isLoading}
        >
          {isLoading ? <>Adding Review</> : <>Add Review</>}
        </Button>
      </Wrapper>
    </Fade>
  );
};

export default AddReview;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Btn = styled.button`
  width: 200px;
  height: 50px;
  margin: auto;
  margin-top: 4rem;
  border: 1px solid;
  border-radius: 20px;
  text-align: center;
  background-color: #eb7347;
  color: white;
  padding: 20px 40px;
  cursor: pointer;
  font-size: 11pt;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const Container = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const Title = styled.div`
  font-size: 14pt;
  font-weight: 500;
  margin-top: 15px;
`;
