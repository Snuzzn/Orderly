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
import { prepTimeOptions } from "./AddItemModal";
import { fetchRequest } from "../../../../helper/fetchRequest";

type Props = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
};

type FormData = {
  title: string;
  price: number;
  description: string;
};

const EditItemModal: React.FC<Props> = ({ setIsOpen, isOpen }) => {
  const [errorMessage, setErrorMessage] = React.useState("");
  const [value, setValue] = React.useState<Value>([]);
  const [formData, setFormData] = React.useState<FormData>({
    title: "",
    price: 0,
    description: "",
  });
  const [prepTime, setPrepTime] = React.useState<Value>([]);
  const [dietTypes, setDietTypes] = React.useState<Value>([]);
  const { categoryName } = useParams();
  const { oId, accessToken } = React.useContext(AuthContext);
  const [item_id, setItem_id] = React.useState("");
  const [category, setCategory] = React.useState(categoryName);
  const [categories, setCategories] = React.useState([]);

  const deleteCustomisation = (ind: any) => {
    setCustomisations(
      customisations.filter((item: any, index: any) => index !== ind)
    );
  };

  React.useEffect(() => {
    const fetchItemDetails = async () => {
      const url = `http://localhost:3001/menu/item/${localStorage.getItem(
        "itemId"
      )}`;
      try {
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await res.json();
        const itemDetails = data;
        setFormData({
          title: itemDetails.title,
          price: itemDetails.price,
          description: itemDetails.description,
        });
        const diets = itemDetails.dietType.map((item: string) => {
          return { id: dietTypesObj[item as keyof DietTypes], value: item };
        });
        setPrepTime([{ id: itemDetails.prepTime }]);
        setDietTypes(diets);
        setPhoto(itemDetails.img);
        setItem_id(itemDetails.item_id);
        setCustomisations(itemDetails.customisations);
        setCategory(categoryName);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchCategories = async () => {
      const [data, err] = await fetchRequest(
        `http://localhost:3001/menu/categories/${oId}`,
        "get",
        null
      );

      setCategories(
        data.output.map((cat: string) => {
          return { value: cat };
        })
      );
    };

    if (isOpen === true) {
      fetchItemDetails();
      fetchCategories();
    }
  }, [isOpen]);

  const updateFormData = (e: any) => {
    const key = e.target.name;
    if (key === "price" && isNaN(e.target.value)) return;
    setFormData({ ...formData, [key]: e.target.value });
  };

  const handleEditItem = async (e: any) => {
    e.preventDefault();
    const body = {
      ...formData,
      prepTime: prepTime[0].id,
      dietType: dietTypes.map((diet) => diet.value),
      img: photo,
      category: category,
      customisations: customisations.length === 0 ? [] : customisations,
      item_id: item_id,
    };
    const toastId = toast.loading("Loading...");
    const url = `http://localhost:3001/menu/item/edit/${oId}`;
    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success)
        showToast("Successfully edited item!", "success", toastId);
      else showToast("Something went wrong", "error", toastId);
      setIsOpen(false);
    } catch (err) {
      console.log(err);
      showToast("Could not edit item", "error", toastId);
    }
  };

  const toBase64 = (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const [photo, setPhoto] = React.useState<any>(null);

  const [customisations, setCustomisations] = React.useState<any>([]);

  const updateCustomisation = (ind: any, customisation: any) => {
    const copy = [...customisations];
    copy[ind] = customisation;
    setCustomisations(copy);
  };

  const baseCustomisation = {
    title: "",
    required: false,
    range: [0, 1],
    options: [{ title: "", price: 0 }],
  };

  return (
    <ModalTemplate setIsOpen={setIsOpen} isOpen={isOpen}>
      <form onSubmit={handleEditItem}>
        <ModalHeader>Edit menu item</ModalHeader>
        <ModalBody>
          <FormControl label={() => "Name*"}>
            <Input
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
              required
              autoComplete="off"
            />
          </FormControl>

          <FormControl label={() => "Category*"}>
            <Select
              options={categories}
              labelKey="value"
              valueKey="value"
              placeholder="Choose item's category"
              maxDropdownHeight="300px"
              onChange={({ value }) => setCategory(value[0].value)}
              value={[{ value: category }]}
              clearable={false}
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

          <img src={photo} alt="" width="100%" />
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
              customisation={customisations[ind]}
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
          <ModalButton type="submit">Edit</ModalButton>
        </ModalFooter>
      </form>
    </ModalTemplate>
  );
};

export default EditItemModal;

const dietTypesObj = {
  V: "Vegetarian",
  VG: "Vegan",
};

interface DietTypes {
  V: string;
  VG: string;
}
