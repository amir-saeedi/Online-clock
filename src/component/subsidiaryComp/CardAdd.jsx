import React from "react";
import { FaPlus, FaEllipsisV } from "react-icons/fa";
function toggleShowElement(element, act) {
  document.getElementById(`${element}`).style.display = act;
}
export function openHandelAdd() {
  toggleShowElement("myModal", "block");
  window.onclick = function (event) {
    if (event.target === document.getElementById("myModal")) {
      toggleShowElement("myModal", "none");
    }
  };
}
export function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("main").style.marginLeft = "50px";
}
export default function CardAdd() {
  return (
    <div className="card-add">
      <FaPlus fontSize={20} onClick={openHandelAdd} />
      <FaEllipsisV fontSize={21} onClick={openNav} />
    </div>
  );
}
//
