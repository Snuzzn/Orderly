import React, { useContext } from "react";
import { ModalHeader, ModalBody, ModalFooter, ModalButton } from "baseui/modal";
import { KIND as ButtonKind } from "baseui/button";
import { Input } from "baseui/input";
import ModalTemplate from "../../../components/ModalTemplate";
import { withAuthInfo } from "@propelauth/react";
import { AuthContext } from "../../../context/AuthContext";
import { showToast } from "../../../helper/toast";
import toast from "react-hot-toast";

type Props = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
};

const AddCategoryModal: React.FC<any> = ({
  setIsOpen,
  isOpen,
  accessToken,
}) => {
  const [category, setCategory] = React.useState("");

  const { oId } = useContext(AuthContext);

  const handleAdd = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Loading...");
    try {
      const res = await fetch(`http://localhost:3001/menu/category/${oId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ categoryTitle: category }),
      });
      const data = await res.json();
      if (data.success)
        showToast("Successfully added category!", "success", toastId);
      else showToast("Something went wrong", "error", toastId);
      setIsOpen(false);
    } catch (err) {
      console.log(err);
      showToast("Could not add category", "error", toastId);
      setIsOpen(false);
    }
  };

  return (
    <ModalTemplate setIsOpen={setIsOpen} isOpen={isOpen}>
      <form onSubmit={handleAdd}>
        <ModalHeader>Add new category</ModalHeader>
        <ModalBody>
          <Input
            placeholder="e.g. Mains"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCategory(e.target.value)
            }
            required={true}
            autoComplete="off"
          />
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

export default withAuthInfo(AddCategoryModal);
