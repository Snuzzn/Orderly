import { Heading, HeadingLevel } from "baseui/heading";
import React, { useContext } from "react";
import MenuItem from "../../../../components/menu/MenuItem";
import { Breadcrumbs } from "baseui/breadcrumbs";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import {
  AddBtn,
  breadcrumbOverrides,
  CurrLink,
  DraggableItem,
  DroppableCont,
  GreyedLink,
  TitleCont,
} from "../../../../components/styles";
import AddItemModal from "./AddItemModal";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { MdDragIndicator } from "react-icons/md";
import { Skeleton } from "baseui/skeleton";
import { motion } from "framer-motion";
import { AuthContext } from "../../../../context/AuthContext";
import { BiEditAlt, BiTrashAlt } from "react-icons/bi";
import EditItemModal from "./EditItemDialog";
import toast from "react-hot-toast";
import { showToast } from "../../../../helper/toast";
import ToggleButton from "../../../../components/SideDrawer/DrawerToggleButton";
import DeleteItemModal from "./DeleteItemModal";
import meal from "../../../../images/meal.svg";
import { EmptyWrapper } from "../../../../components/Reviews/Main";

const Category = () => {
  const { categoryName } = useParams();
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isDltOpen, setIsDltOpen] = React.useState(false);
  const [itemIds, setItemIds] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const { oId, accessToken } = React.useContext(AuthContext);
  React.useEffect(() => {
    setIsLoading(true);
    // const url = "http://localhost:3000/mockData/itemsInCategory.json"
    const url = `http://localhost:3001/menu/${categoryName}/${oId}`;
    const fetchItemIds = async () => {
      try {
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          setItemIds(data.output);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchItemIds();
    setTimeout(() => setIsLoading(false), 600);
  }, [isAddOpen, isEditOpen, isDltOpen]);

  const handleDrop = async (droppedItem: any) => {
    // Ignore drop outside droppable container
    if (!droppedItem.destination) return;
    var updatedList = [...itemIds];
    // Remove dragged item
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    // Add dropped item
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
    // Update State
    setItemIds(updatedList);
    reorderItems(updatedList);
  };

  const reorderItems = async (updatedList: any) => {
    const toastId = toast.loading("Loading...");
    const url = `http://localhost:3001/menu/items/${oId}`;
    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          categoryName: categoryName,
          items: updatedList,
        }),
      });
      const data = await res.json();
      if (data.success)
        showToast("Successfully reordered items!", "success", toastId);
      else showToast("Something went wrong", "error", toastId);
    } catch (err) {
      console.log(err);
      showToast("Could not reorder items", "error", toastId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: "easeOut", duration: 0.2 }}
      exit={{ opacity: 0 }}
    >
      <AddItemModal isOpen={isAddOpen} setIsOpen={setIsAddOpen} />
      <EditItemModal isOpen={isEditOpen} setIsOpen={setIsEditOpen} />
      <DeleteItemModal isOpen={isDltOpen} setIsOpen={setIsDltOpen} />
      <Breadcrumbs overrides={breadcrumbOverrides}>
        <GreyedLink to="/manager/menu">Categories</GreyedLink>
        <CurrLink>Current</CurrLink>
      </Breadcrumbs>
      <HeadingLevel>
        <TitleCont>
          <Heading styleLevel={4}>{categoryName}</Heading>
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
            <DroppableCont {...provided.droppableProps} ref={provided.innerRef}>
              {!isLoading ? (
                <>
                  {itemIds.map((item: string, index) => {
                    return (
                      <Draggable
                        key={item}
                        draggableId={item.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <DraggableItem
                            ref={provided.innerRef}
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                          >
                            {!isLoading && <DragIndicator />}
                            <div
                              style={
                                !isLoading
                                  ? { width: "80%" }
                                  : { width: "100%" }
                              }
                            >
                              <MenuItem itemId={item} />
                            </div>
                            {!isLoading && (
                              <IconCont>
                                <IconWrapper
                                  onClick={() => {
                                    localStorage.setItem("itemId", item);
                                    setIsEditOpen(true);
                                  }}
                                >
                                  <BiEditAlt />
                                </IconWrapper>
                                <IconWrapper
                                  onClick={() => {
                                    localStorage.setItem("itemId", item);
                                    setIsDltOpen(true);
                                  }}
                                >
                                  <BiTrashAlt />
                                </IconWrapper>
                              </IconCont>
                            )}
                          </DraggableItem>
                        )}
                      </Draggable>
                    );
                  })}
                </>
              ) : (
                <SkeletonCont>
                  <Skeleton width="100%" height="150px" animation />
                  <Skeleton width="100%" height="150px" animation />
                  <Skeleton width="100%" height="150px" animation />
                  <Skeleton width="100%" height="150px" animation />
                  <Skeleton width="100%" height="150px" animation />
                  <Skeleton width="100%" height="150px" animation />
                  <Skeleton width="100%" height="150px" animation />
                </SkeletonCont>
              )}

              {provided.placeholder}
            </DroppableCont>
          )}
        </Droppable>
      </DragDropContext>
    </motion.div>
  );
};

export default Category;

const DragIndicator = styled(MdDragIndicator)`
  width: 1.5em;
  height: 1.5em;
  color: #cccccc;

  @media (min-width: 768px) {
    width: 1em;
    height: 2em;
  }
`;

const IconCont = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  color: #d07449;
  cursor: pointer;
`;

export const IconWrapper = styled.div`
  border: 2px solid #ebc6b5;
  padding: 4px;
  border-radius: 50%;
  width: 1.5em;
  height: 1.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d07449;
  cursor: pointer;

  &:hover {
    background-color: #ebc6b5;
  }
`;

const SkeletonCont = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;
