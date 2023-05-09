import React, { useContext } from "react";
import { ModalHeader, ModalBody, ModalFooter, ModalButton } from "baseui/modal";
import { KIND as ButtonKind } from "baseui/button";
import { Input } from "baseui/input";
import ModalTemplate from "../../../../components/ModalTemplate";
import toast from "react-hot-toast";
import { AuthContext } from "../../../../context/AuthContext";
import { showToast } from "../../../../helper/toast";

type Props = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
};

const DeleteItemModal: React.FC<Props> = ({ setIsOpen, isOpen }) => {
  const { oId, accessToken } = useContext(AuthContext);
  const handleDelete = async () => {
    const toastId = toast.loading("Loading...");
    const url = `http://localhost:3001/menu/item/${localStorage.getItem(
      "itemId"
    )}/${oId}`;
    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      if (data) showToast("Successfully deleted item!", "success", toastId);
      else showToast("Something went wrong", "error", toastId);
    } catch (err) {
      console.log(err);
      showToast("Could not delete item", "error", toastId);
    }
    setIsOpen(false);
  };

  return (
    <ModalTemplate setIsOpen={setIsOpen} isOpen={isOpen}>
      <ModalHeader>Remove this item?</ModalHeader>
      <ModalBody>You can't undo this action.</ModalBody>
      <ModalFooter>
        <ModalButton
          kind={ButtonKind.tertiary}
          onClick={() => setIsOpen(false)}
        >
          Cancel
        </ModalButton>
        <ModalButton
          onClick={handleDelete}
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

export default DeleteItemModal;
