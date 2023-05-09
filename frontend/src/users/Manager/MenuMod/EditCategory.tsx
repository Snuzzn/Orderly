import React, { useContext } from "react";
import { ModalHeader, ModalBody, ModalFooter, ModalButton } from "baseui/modal";
import { KIND as ButtonKind } from "baseui/button";
import { Input } from "baseui/input";
import ModalTemplate from "../../../components/ModalTemplate";
import { AuthContext } from "../../../context/AuthContext";
import { showToast } from "../../../helper/toast";
import toast from "react-hot-toast";

type Props = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
};

const EditCategoryModal: React.FC<any> = ({ setIsOpen, isOpen }) => {
  const [category, setCategory] = React.useState<string>(
    localStorage.getItem("category") || ""
  );

  const { oId, accessToken } = useContext(AuthContext);

  React.useEffect(() => {
    if (isOpen) setCategory(localStorage.getItem("category") || "");
  }, [isOpen]);

  const handleEdit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Loading...");
    try {
      const res = await fetch(
        `http://localhost:3001/menu/${localStorage.getItem("category")}/${oId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ newCategory: category }),
        }
      );
      const data = await res.json();
      if (data) showToast("Successfully edited category!", "success", toastId);
      else showToast("Something went wrong", "error", toastId);
      setIsOpen(false);
    } catch (err) {
      console.log(err);
      showToast("Could not edit category", "error", toastId);
      setIsOpen(false);
    }
  };

  return (
    <ModalTemplate setIsOpen={setIsOpen} isOpen={isOpen}>
      <form onSubmit={handleEdit}>
        <ModalHeader>Edit category title</ModalHeader>
        <ModalBody>
          <Input
            placeholder="Edit category"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCategory(e.target.value)
            }
            value={category}
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

export default EditCategoryModal;
