import { Breadcrumbs } from "baseui/breadcrumbs";
import { Button } from "baseui/button";
import { Heading, HeadingLevel } from "baseui/heading";
import { Slider } from "baseui/slider";
import React, { useContext, useRef } from "react";
import styled from "styled-components";
import {
  breadcrumbOverrides,
  CurrLink,
  GreyedLink,
  TitleCont,
} from "../../../components/styles";
import { AuthContext } from "../../../context/AuthContext";
import { HeadingLarge } from "baseui/typography";
import { useReactToPrint } from "react-to-print";
import { FormControl } from "baseui/form-control";
import { BiPrinter } from "react-icons/bi";
var QRCode = require("qrcode.react");

const QRCodes = () => {
  let { oId } = useContext(AuthContext);
  const [value, setValue] = React.useState([1]);

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <div>
      <Breadcrumbs overrides={breadcrumbOverrides}>
        <GreyedLink to="/manager/setup">Setup</GreyedLink>
        <CurrLink>Current</CurrLink>
      </Breadcrumbs>
      <HeadingLevel>
        <TitleCont>
          <Heading styleLevel={4}>QR Codes</Heading>
          <Button onClick={handlePrint}>
            <BiPrinter size="1.2em" /> &nbsp; Print
          </Button>
        </TitleCont>
      </HeadingLevel>
      <FormControl label="Number of Tables">
        <Slider
          value={value}
          onChange={({ value }) => value && setValue(value)}
          max={50}
          min={1}
        />
      </FormControl>

      <CenteredCont ref={componentRef}>
        {[...Array(value[0])].map((val, ind) => (
          <CodeCont>
            <QRCode
              size={200}
              value={`http://localhost:3813/restaurant/${oId}/table/${
                ind + 1
              }/menu`}
            />
            <HeadingLarge>Table {ind + 1}</HeadingLarge>
          </CodeCont>
        ))}
      </CenteredCont>
    </div>
  );
};

export default QRCodes;

const CenteredCont = styled.div`
  display: flex;
  margin-top: 20px;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  width: 100%;
`;

const CodeCont = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
`;
