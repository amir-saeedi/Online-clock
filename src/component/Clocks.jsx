import React from "react";
import { FaTrash } from "react-icons/fa";

import SetTimer from "./subsidiaryComp/SetTimer";
import CardAdd from "./subsidiaryComp/CardAdd";
import Modal from "./subsidiaryComp/Modal";
import { BottomNav } from "./NavSlde";
import { dragStart, dragEnter, drop } from "./subsidiaryComp/Drog";
import Loading from "./subsidiaryComp/Loading";

import { timeWorld, generateId } from "../utils/timeWorld";
import ClockStyle from "./subsidiaryComp/ClockStyle";

export default function Clocks() {
  const [userLocation, setUserLocation] = React.useState(null);
  const [addInitialContinents, setAddInitialContinents] = React.useState([]);
  const dragItem = React.useRef();
  const dragOverItem = React.useRef();

  React.useEffect(() => {
    // Reall time with user location
    timeWorld("Asia", "Tehran")
      .then((result) =>
        setUserLocation(
          dataClock(
            result.timezone.split("/")[0],
            result.timezone.split("/")[1],
            dataClockTime(result),
            result.utc_offset
          )
        )
      )
      .catch((e) => console.error(e));
    // 2 wolrd time with base location Iran and London
    const initialContinents = [
      { continent: "Europe", capital: "London" },
      { continent: "Asia", capital: "Tehran" },
    ];
    for (let i = 0; i < initialContinents.length; i++) {
      timeWorld(
        initialContinents[i].continent,
        initialContinents[i].capital
      ).then((result) => {
        setAddInitialContinents((data) => [
          dataClock(
            initialContinents[i].continent,
            initialContinents[i].capital,
            dataClockTime(result),
            result.utc_offset
          ),
          ...data,
        ]);
      });
    }
  }, []);
  ////////////////////////////////////////////////////
  // function for object States
  function dataClock(continent, capital, time, offset) {
    return {
      id: generateId(),
      continent: continent,
      capital: capital,
      time: time,
      offset: offset,
    };
  }
  function dataClockTime(result) {
    return result.datetime.slice(
      result.datetime.indexOf("T") + 1,
      result.datetime.indexOf(".")
    );
  }
  function setOffset(a, b) {
    const h = +b.offset.split(":")[0] - +a.offset.split(":")[0];
    const m = +b.offset.split(":")[1] - +a.offset.split(":")[1];
    if (h < 0 || m < 0) {
      return `${Math.abs(h)} hrs ${Math.abs(m)} mins behind`;
    } else if (h > 0 || m > 0) {
      return `${Math.abs(h)} hrs ${Math.abs(m)} mins ahead`;
    } else if (h === 0 && m === 0) {
      return "Local time zone";
    }
  }
  /////////////////////////////////////////////////////
  // functions for handel add world time
  function toggleShowElement(element, act) {
    document.getElementById(`${element}`).style.display = act;
  }
  function handelAdd(e) {
    toggleShowElement("myModal", "none");
    const continent = e.fields.timezone.split("/")[0];
    const capital = e.fields.timezone.split("/")[1];
    timeWorld(continent, capital).then((result) => {
      setAddInitialContinents((d) => [
        dataClock(continent, capital, dataClockTime(result), result.utc_offset),
        ...d,
      ]);
    });
  }
  function handelDelete(data) {
    const id = addInitialContinents.findIndex((d) => d.id === data.id);
    setAddInitialContinents((d) => [
      ...d.slice(0, id),
      ...d.slice(id + 1, d.length),
    ]);
  }
  const isLoadngUserTime = () => userLocation === null;
  const isLoadngInitial = () => addInitialContinents === null;

  return (
    <React.Fragment>
      <div className={`card`} id="main">
        {isLoadngUserTime() && <Loading />}
        {userLocation && (
          <div className="card-title">
            <ClockStyle timeState={userLocation.time} />
            <h2>{<SetTimer timeState={userLocation.time} needSec={true} />}</h2>
            <p>{userLocation.capital} Daylight Time</p>
          </div>
        )}

        <div className="card-body">
          <div className="card-body-title">
            <h3>Word clock</h3>
            <CardAdd />
          </div>
          <ul>
            {isLoadngInitial() && <Loading />}
            {addInitialContinents.length > 0 &&
              addInitialContinents.map((data, index) => {
                return (
                  <li
                    className="cardly"
                    key={data.id}
                    draggable
                    onDragStart={() => dragStart(dragItem, index)}
                    onDragEnter={() => dragEnter(dragOverItem, index)}
                    onDragEnd={() =>
                      drop(
                        addInitialContinents,
                        setAddInitialContinents,
                        dragItem,
                        dragOverItem
                      )
                    }
                  >
                    <h3>
                      {data.capital}{" "}
                      <span>
                        {userLocation && setOffset(userLocation, data)}
                      </span>
                    </h3>
                    <p> {<SetTimer timeState={data.time} needSec={false} />}</p>
                    <div>
                      {" "}
                      <FaTrash
                        fontSize={20}
                        onClick={() => handelDelete(data)}
                      />
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
        <BottomNav />
      </div>
      <Modal handelAdd={handelAdd} />
    </React.Fragment>
  );
}
