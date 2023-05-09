import React from "react";
import styled from "styled-components";
import NotFound from "../../images/404Error.svg";
import { motion } from "framer-motion";
import Fade from "../Fade";

type Props = {};

const Error = (props: Props) => {
  return (
    <Fade>
      <Cont>
        <ErrorImg src={NotFound} />
        <Title>Page Not Found...</Title>
      </Cont>
    </Fade>
  );
};

export default Error;

const Cont = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
`;

const ErrorImg = styled.img`
  @media (min-width: 768px) {
    width: 600px;
  }
  width: 80%;
`;

const Title = styled.h1`
  font-weight: 600;
  color: #e28662;
`;
