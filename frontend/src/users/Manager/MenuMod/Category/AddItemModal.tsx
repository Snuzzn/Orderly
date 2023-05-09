import { ModalBody, ModalButton, ModalFooter, ModalHeader } from "baseui/modal";
import React from "react";
import ModalTemplate from "../../../../components/ModalTemplate";
import { KIND as ButtonKind } from "baseui/button";
import { FileUploader } from "baseui/file-uploader";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Textarea } from "baseui/textarea";
import { Select, StatefulSelect, TYPE, Value } from "baseui/select";
import { ParagraphLarge } from "baseui/typography";
import { Plus } from "baseui/icon";
import { TitleCont } from "../../../../components/styles";
import { Checkbox, STYLE_TYPE } from "baseui/checkbox";
import { Slider } from "baseui/slider";
import Customisations from "../../Customisations";
import { AuthContext } from "../../../../context/AuthContext";
import toast from "react-hot-toast";
import { showToast } from "../../../../helper/toast";
import { useParams } from "react-router-dom";
import { IconWrapper } from "./Main";

type Props = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
};

type FormData = {
  title: string;
  price: string;
  description: string;
};

const AddItemModal: React.FC<Props> = ({ setIsOpen, isOpen }) => {
  const [errorMessage, setErrorMessage] = React.useState("");
  const [value, setValue] = React.useState<Value>([]);
  const [formData, setFormData] = React.useState<FormData>({
    title: "",
    price: "",
    description: "",
  });
  const [prepTime, setPrepTime] = React.useState<Value>([]);
  const [dietTypes, setDietTypes] = React.useState<Value>([]);
  const [photo, setPhoto] = React.useState<any>(null);
  const [customisations, setCustomisations] = React.useState<any>([]);

  const updateCustomisation = (ind: any, customisation: any) => {
    const copy = [...customisations];
    copy[ind] = customisation;
    setCustomisations(copy);
  };

  const deleteCustomisation = (ind: any) => {
    setCustomisations(
      customisations.filter((item: any, index: any) => index !== ind)
    );
  };

  const updateFormData = (e: any) => {
    const key = e.target.name;
    if (key === "price" && isNaN(e.target.value)) return;
    setFormData({ ...formData, [key]: e.target.value });
  };

  const { categoryName } = useParams();
  const { oId, accessToken } = React.useContext(AuthContext);

  const handleAddItem = async (e: any) => {
    e.preventDefault();
    const body = {
      ...formData,
      prepTime: prepTime[0].value,
      dietType: dietTypes.map((diet) => diet.value),
      img: photo,
      category: categoryName,
      customisations: customisations.length === 0 ? [] : customisations,
    };
    const toastId = toast.loading("Loading...");
    const url = `http://localhost:3001/menu/item/${oId}`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data) showToast("Successfully added item!", "success", toastId);
      else showToast("Something went wrong", "error", toastId);
      setIsOpen(false);
      resetForm();
    } catch (err) {
      console.log(err);
      showToast("Could not add item", "error", toastId);
      setIsOpen(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", price: "0", description: "" });
    setPrepTime([]);
    setDietTypes([]);
    setPhoto("");
  };

  const toBase64 = (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const baseCustomisation = {
    title: "",
    required: false,
    range: [0, 1],
    options: [{ title: "", price: 0 }],
  };

  return (
    <ModalTemplate setIsOpen={setIsOpen} isOpen={isOpen}>
      <form onSubmit={handleAddItem}>
        <ModalHeader>Add new menu item</ModalHeader>
        <ModalBody>
          <FormControl label={() => "Name*"}>
            <Input
              placeholder="Enter name of menu item"
              name="title"
              value={formData.title}
              onChange={updateFormData}
              required
              autoComplete="off"
            />
          </FormControl>
          <FormControl label={() => "Description*"}>
            <Textarea
              name="description"
              value={formData.description}
              onChange={updateFormData}
              placeholder="Enter short description about the item"
              required
            />
          </FormControl>

          <FormControl label={() => "Price*"}>
            <Input
              startEnhancer="$"
              placeholder="10.00"
              name="price"
              value={formData.price}
              onChange={updateFormData}
              required
              autoComplete="off"
            />
          </FormControl>
          <FormControl label={() => "Preparation Time*"}>
            <Select
              options={prepTimeOptions}
              labelKey="id"
              valueKey="value"
              onChange={({ value }) => setPrepTime(value)}
              value={prepTime}
              placeholder="Select preparation time"
              required
            />
          </FormControl>
          <FormControl label={() => "Dietary requirement"}>
            <Select
              options={[
                { id: "Vegan", value: "VG" },
                { id: "Vegetarian", value: "V" },
              ]}
              labelKey="id"
              valueKey="value"
              placeholder="Choose dietary requirements"
              maxDropdownHeight="300px"
              multi
              onChange={({ value }) => setDietTypes(value)}
              value={dietTypes}
            />
          </FormControl>
          <FormControl label={() => "Photo"}>
            <FileUploader
              errorMessage={errorMessage}
              onDrop={async (acceptedFiles, rejectedFiles) => {
                // handle file upload...
                const base64 = await toBase64(acceptedFiles[0]);
                setPhoto(base64);
              }}
            />
          </FormControl>
          <img src={photo} width="100%" alt="" />
          <TitleCont>
            <ParagraphLarge>Customisations</ParagraphLarge>
            <IconWrapper
              onClick={() =>
                setCustomisations([...customisations, baseCustomisation])
              }
            >
              <Plus />
            </IconWrapper>
          </TitleCont>
          <hr color="#dadada" />
          {customisations.map((item: any, ind: number) => (
            <Customisations
              ind={ind}
              updateCustomisation={updateCustomisation}
              deleteCustomisation={deleteCustomisation}
            />
          ))}
        </ModalBody>
        <ModalFooter>
          <ModalButton
            kind={ButtonKind.tertiary}
            onClick={() => setIsOpen(false)}
            type="button"
          >
            Cancel
          </ModalButton>
          <ModalButton type="submit">Add</ModalButton>
        </ModalFooter>
      </form>
    </ModalTemplate>
  );
};

export default AddItemModal;
export const prepTimeOptions = [
  { id: "1 min", value: 1 },
  { id: "2 min", value: 2 },
  { id: "5 mins", value: 5 },
  { id: "10 mins", value: 10 },
  { id: "15 mins", value: 15 },
  { id: "20 mins", value: 20 },
  { id: "25 mins", value: 25 },
  { id: "30 mins", value: 30 },
  { id: "35 mins", value: 35 },
  { id: "40 mins", value: 40 },
  { id: "45 mins", value: 45 },
  { id: "50 mins", value: 50 },
  { id: "55 mins", value: 55 },
  { id: "60 mins", value: 60 },
  { id: "> 60 mins", value: 70 },
];
