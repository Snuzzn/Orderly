import { Checkbox } from "baseui/checkbox";
import { FormControl } from "baseui/form-control";
import { ALIGN, Radio, RadioGroup } from "baseui/radio";
import { KIND, Tag, VARIANT } from "baseui/tag";
import React from "react";
import styled from "styled-components";
import { Option } from "./ItemDetails";

type Props = {
  customisation: CustomisationProps;
  update: any;
};

type CustomisationProps = {
  title: string;
  required: boolean;
  range: number[];
  options: Option[];
};

const Customisation: React.FC<Props> = ({ customisation, update }) => {
  const [checkboxes, setCheckboxes] = React.useState([false]);
  React.useEffect(() => {
    const checks = Array(customisation.options.length).fill(false);
    setCheckboxes(checks);
  }, []);

  const [isDisabled, setIsDisabled] = React.useState(false);

  React.useEffect(() => {
    const numChecked = checkboxes.reduce((acc, isChecked) => {
      if (isChecked) return acc + 1;
      else return acc;
    }, 0);
    if (numChecked >= customisation.range[1]) setIsDisabled(true);
    else setIsDisabled(false);
  }, [checkboxes]);

  return (
    <div>
      <QuestionCont>
        <Title>{customisation.title}</Title>
        <Range>{`(${customisation.range[0]} to ${customisation.range[1]})`}</Range>
        <TagWrapper>
          <Tag
            closeable={false}
            kind={customisation.required ? KIND.red : KIND.neutral}
            variant={VARIANT.outlined}
          >
            {customisation.required ? "Required" : "Optional"}
          </Tag>
        </TagWrapper>
      </QuestionCont>
      <CheckboxGroup>
        {checkboxes.map((isChecked, index) => (
          <OptionCont key={index}>
            <Checkbox
              checked={checkboxes[index]}
              onChange={(e) => {
                const newChecks = [...checkboxes];
                newChecks[index] = e.currentTarget.checked;
                setCheckboxes(newChecks);
                let op = "add";
                if (!e.currentTarget.checked) op = "remove";
                update(
                  op,
                  customisation.options[index].title,
                  customisation.options[index].price,
                  customisation.title
                );
              }}
              disabled={isDisabled && !isChecked}
            >
              <OptionTxt>{customisation.options[index].title}</OptionTxt>
            </Checkbox>
            <OptionPrice isDisabled={isDisabled && !isChecked}>
              ${Number(customisation.options[index].price).toFixed(2)}
            </OptionPrice>
          </OptionCont>
        ))}
      </CheckboxGroup>
    </div>
  );
};

export default Customisation;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
  width: 100%;
`;

const QuestionCont = styled.div`
  display: flex;
  align-items: center;
  font-size: 14pt;
  margin-bottom: 2px;
  gap: 5px;
`;

const Range = styled.div`
  font-weight: normal;
  font-size: smaller;
`;

const TagWrapper = styled.div`
  margin-left: auto;
`;

const OptionCont = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 90px;
  font-weight: normal;
`;

const OptionTxt = styled.div`
  font-weight: normal;
`;

const OptionPrice = styled.div<{ isDisabled: boolean }>`
  color: ${(props) => (props.isDisabled ? "#545454" : "#000000")};
`;

export const Title = styled.div`
  font-size: 13pt;
  font-weight: 500;
`;
