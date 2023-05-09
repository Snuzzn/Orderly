import { Button, KIND } from "baseui/button";
import { Checkbox, STYLE_TYPE } from "baseui/checkbox";
import { FormControl } from "baseui/form-control";
import { Plus } from "baseui/icon";
import { Input } from "baseui/input";
import { Slider } from "baseui/slider";
import { ParagraphLarge } from "baseui/typography";
import React, { FC } from "react";
import toast from "react-hot-toast";
import { BiMinus } from "react-icons/bi";
import styled from "styled-components";
import { TitleCont } from "../../components/styles";

interface Option {
  title: string;
  price: string;
}

interface Props {
  ind: any;
  updateCustomisation: any;
  customisation?: any;
  deleteCustomisation: any;
}

const Customisations: FC<Props> = ({
  ind,
  updateCustomisation,
  customisation,
  deleteCustomisation,
}) => {
  const [isRequired, setIsRequired] = React.useState(
    customisation?.required || false
  );
  const [title, setTitle] = React.useState(customisation?.title || "");
  const [options, setOptions] = React.useState<Option[]>(
    customisation?.options || [{ title: "", price: "" }]
  );
  const [optionRange, setOptionRange] = React.useState(
    customisation?.range || [0, 1]
  );

  React.useEffect(() => {
    if (customisation) {
      setTitle(customisation.title);
      setOptionRange(customisation.range);
      setIsRequired(customisation.required);
      setOptions(customisation.options);
    }
  }, [customisation]);

  const defaultOption = { title: "", price: "" };

  const editOptions = (e: any, i: number, type: string) => {
    const newOptions = [...options];
    if (type === "price") {
      if (!isNaN(e.target.value)) newOptions[i].price = e.target.value;
    }
    if (type === "title") newOptions[i].title = e.target.value;
    setOptions(newOptions);
  };

  const update = () => {
    const customisation = {
      title: title,
      required: isRequired,
      range: optionRange,
      options: options,
    };
    updateCustomisation(ind, customisation);
  };

  React.useEffect(() => {
    update();
  }, [optionRange, isRequired, title, options]);

  const removeOption = (ind: number) => {
    if (options.length <= 1) {
      toast.error("Your customisation needs at least one selection.");
      return;
    }
    const copy = [...options];
    copy.splice(ind, 1);
    setOptions(copy);
  };

  return (
    <div>
      <FormControl
        label={() => (
          <TitleCont>
            Title
            <BiMinus
              onClick={() => deleteCustomisation(ind)}
              style={{ cursor: "pointer" }}
            />
          </TitleCont>
        )}
      >
        <Input
          placeholder="Name of customisation"
          value={title}
          onChange={(e: any) => setTitle(e.target.value)}
          autoComplete="off"
        />
      </FormControl>
      <OptionsCont>
        {options.map((option, ind) => (
          <>
            <FormControl
              label={() => (
                <TitleCont>
                  Option {ind + 1}
                  <BiMinus
                    onClick={() => removeOption(ind)}
                    style={{ cursor: "pointer" }}
                  />
                </TitleCont>
              )}
            >
              <Input
                placeholder="Name of choice"
                onChange={(e) => editOptions(e, ind, "title")}
                value={option.title}
                autoComplete="off"
              />
            </FormControl>
            <Input
              placeholder="Price ($)"
              value={option.price}
              onChange={(e) => editOptions(e, ind, "price")}
              autoComplete="off"
            />
          </>
        ))}
      </OptionsCont>

      <Button
        type="button"
        onClick={() => setOptions([...options, defaultOption])}
        kind={KIND.minimal}
        overrides={{
          Root: {
            style: {
              border: "1px solid #F29B73",
              borderRadius: "10px",
              padding: "10px",
              marginBottom: "10px",
            },
          },
        }}
      >
        Add option
      </Button>

      <FormControl label={() => "Range of Options Allowed"}>
        <Slider
          value={optionRange}
          onChange={({ value }) => setOptionRange(value)}
          max={options.length} // make this equal to number of options made
          min={0}
        />
      </FormControl>
      <FormControl label={() => (isRequired ? "Required" : "Optional")}>
        <Checkbox
          checked={isRequired}
          onChange={(e) => {
            setIsRequired(e.currentTarget.checked);
          }}
          checkmarkType={STYLE_TYPE.toggle_round}
        ></Checkbox>
      </FormControl>
      <hr color="#dadada" />
    </div>
  );
};

export default Customisations;

const OptionsCont = styled.div`
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
`;
