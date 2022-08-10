const dragStart = (dragItem, position) => {
  dragItem.current = position;
  // console.log(e.target.innerHTML);
};

const dragEnter = (dragOverItem, position) => {
  dragOverItem.current = position;
  // console.log(e.target.innerHTML);
};

const drop = (list, setList, dragItem, dragOverItem) => {
  const copyListItems = [...list];
  const dragItemContent = copyListItems[dragItem.current];
  copyListItems.splice(dragItem.current, 1);
  copyListItems.splice(dragOverItem.current, 0, dragItemContent);
  dragItem.current = null;
  dragOverItem.current = null;
  setList(copyListItems);
};
export { dragStart, dragEnter, drop };
