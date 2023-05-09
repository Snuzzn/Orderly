import React, { useContext } from "react";
import styled from "styled-components";
import { Heading, HeadingLevel } from "baseui/heading";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { MdDragIndicator } from "react-icons/md";
import AddCategoryModal from "./AddCategoryModal";
import { AddBtn, TitleCont } from "../../../components/styles";
import { DroppableCont } from "../../../components/styles";
import { DraggableItem } from "../../../components/styles";
import DeleteCategoryModal from "./DeleteModal";
import { motion } from "framer-motion";
import { AuthContext } from "../../../context/AuthContext";
import { withAuthInfo } from "@propelauth/react";
import toast from "react-hot-toast";
import { showToast } from "../../../helper/toast";
import { IconWrapper } from "./Category/Main";
import { BiEditAlt, BiTrashAlt } from "react-icons/bi";
import EditCategoryModal from "./EditCategory";
import ToggleButton from "../../../components/SideDrawer/DrawerToggleButton";

const MenuMod: React.FC<any> = ({ accessToken }) => {
  const [categories, setCategories] = React.useState<string[]>([]);
  let navigate = useNavigate();
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [isDltOpen, setIsDltOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);

  let { oId } = useContext(AuthContext);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const url = `http://localhost:3001/menu/categories/${oId}`;
        const res = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await res.json();
        setCategories(data.output);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCategories();
  }, [isAddOpen, isDltOpen, isEditOpen]);

  const handleDrop = async (droppedItem: any) => {
    // Ignore drop outside droppable container
    if (!droppedItem.destination) return;
    var updatedList = [...categories];
    // Remove dragged item
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    // Add dropped item
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
    // Update State
    setCategories(updatedList);

    reorderCategories(updatedList);
  };

  const reorderCategories = async (updatedList: any) => {
    const toastId = toast.loading("Loading...");
    const url = `http://localhost:3001/menu/categories/${oId}`;
    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          categories: updatedList,
        }),
      });
      const data = await res.json();
      if (data.success)
        showToast("Successfully reordered categories!", "success", toastId);
      else showToast("Something went wrong", "error", toastId);
    } catch (err) {
      console.log(err);
      showToast("Could not reorder category", "error", toastId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: "easeOut", duration: 0.2 }}
      exit={{ opacity: 0 }}
    >
      <Wrapper>
        <AddCategoryModal isOpen={isAddOpen} setIsOpen={setIsAddOpen} />
        <DeleteCategoryModal isOpen={isDltOpen} setIsOpen={setIsDltOpen} />
        <EditCategoryModal isOpen={isEditOpen} setIsOpen={setIsEditOpen} />
        <HeadingLevel>
          <TitleCont>
            <Heading styleLevel={4}>Menu</Heading>
            <ToggleButton />
            <AddBtn
              onClick={() => {
                setIsAddOpen(true);
              }}
            />
          </TitleCont>
        </HeadingLevel>
        <DragDropContext onDragEnd={handleDrop}>
          <Droppable droppableId="list-container">
            {(provided) => (
              <DroppableCont
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {categories.map((item, index) => (
                  <Draggable key={item} draggableId={item} index={index}>
                    {(provided) => (
                      <DraggableItem
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                      >
                        <DragTitle onClick={() => navigate(`${item}`)}>
                          <MdDragIndicator size="1.5em" color="#CCCCCC" />
                          {item}
                        </DragTitle>
                        <IconCont>
                          <IconWrapper>
                            <BiEditAlt
                              onClick={() => {
                                localStorage.setItem("category", item);
                                setIsEditOpen(true);
                              }}
                            />
                          </IconWrapper>
                          <IconWrapper>
                            <BiTrashAlt
                              onClick={() => {
                                localStorage.setItem("category", item);
                                setIsDltOpen(true);
                              }}
                            />
                          </IconWrapper>
                        </IconCont>
                      </DraggableItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </DroppableCont>
            )}
          </Droppable>
        </DragDropContext>
      </Wrapper>
    </motion.div>
  );
};

// export default MenuMod;
export default withAuthInfo(MenuMod);

const Wrapper = styled.div`
  /* align-self: center; */
`;

const DragTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  cursor: pointer;
`;

const IconCont = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;

const Drawer = styled.div`
  width: 60%;
  background-color: blue;
  margin: 0;
  padding: 0;
`;
