import React, { useContext } from "react";
import { ModalHeader, ModalBody, ModalFooter, ModalButton } from "baseui/modal";
import { KIND as ButtonKind } from "baseui/button";
import ModalTemplate from "../../../components/ModalTemplate";
import { AuthContext } from "../../../context/AuthContext";
import { showToast } from "../../../helper/toast";
import toast from "react-hot-toast";

type Props = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
};

const DeleteCategoryModal: React.FC<Props> = ({ setIsOpen, isOpen }) => {
  const { accessToken, oId } = useContext(AuthContext);

  const handleDeleteCategory = async () => {
    const toastId = toast.loading("Loading...");
    const url = `http://localhost:3001/menu/category/${localStorage.getItem(
      "category"
    )}/${oId}`;
    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      if (data) showToast("Successfully deleted category!", "success", toastId);
      else showToast("Something went wrong", "error", toastId);
    } catch (err) {
      console.log(err);
      showToast("Could not delete category", "error", toastId);
    }
    setIsOpen(false);
  };

  return (
    <ModalTemplate setIsOpen={setIsOpen} isOpen={isOpen}>
      <ModalHeader>Remove this category?</ModalHeader>
      <ModalBody>
        All menu items inside will also be removed. You cannot undo this action.
      </ModalBody>
      <ModalFooter>
        <ModalButton
          kind={ButtonKind.tertiary}
          onClick={() => setIsOpen(false)}
        >
          Cancel
        </ModalButton>
        <ModalButton
          onClick={handleDeleteCategory}
          overrides={{
            BaseButton: {
              style: {
                background: "#E53E3E",
              },
            },
          }}
        >
          Remove
        </ModalButton>
      </ModalFooter>
    </ModalTemplate>
  );
};

export default DeleteCategoryModal;
