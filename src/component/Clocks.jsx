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
////////////////////////////////////////////////////
// function for object States
// InformationDataRequest is organizes information in addInitialContinents
const informationDataRequest = (continent, capital, time, offset) => {
  return {
    id: generateId(),
    continent: continent,
    capital: capital,
    time: time,
    offset: offset,
  };
};
// SetTimeInformation is organizes time in informationDataRequest
const setTimeInformation = (result) => {
  return result.datetime.slice(
    result.datetime.indexOf("T") + 1,
    result.datetime.indexOf(".")
  );
};
// SetOffset shows request city offset behind/ahead or time zone to local time zone
const setOffset = (userTime, requestTime) => {
  const hours = +requestTime.split(":")[0] - +userTime.split(":")[0];
  const mins = +requestTime.split(":")[1] - +userTime.split(":")[1];
  if (hours * 60 + mins < 0) {
    return `${Math.abs(hours)} hrs ${Math.abs(mins)} mins behind`;
  } else if (hours * 60 + mins > 0) {
    return `${Math.abs(hours)} hrs ${Math.abs(mins)} mins ahead`;
  } else if (hours === 0 && mins === 0) {
    return "Local time zone";
  }
};
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
          informationDataRequest(
            result.timezone.split("/")[0],
            result.timezone.split("/")[1],
            setTimeInformation(result),
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
          informationDataRequest(
            initialContinents[i].continent,
            initialContinents[i].capital,
            setTimeInformation(result),
            result.utc_offset
          ),
          ...data,
        ]);
      });
    }
  }, []);
  /////////////////////////////////////////////////////
  // Functions handelers world time
  function toggleShowElement(element, act) {
    document.getElementById(`${element}`).style.display = act;
  }
  function handelAdd(e) {
    toggleShowElement("myModal", "none");
    const continent = e.fields.timezone.split("/")[0];
    const capital = e.fields.timezone.split("/")[1];
    timeWorld(continent, capital).then((result) => {
      setAddInitialContinents((d) => [
        informationDataRequest(
          continent,
          capital,
          setTimeInformation(result),
          result.utc_offset
        ),
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
  /////////////////////////////////////////////////////
  // Function loader
  const isLoadngUserTime = () => userLocation === null;
  // const isLoadngInitial = () => addInitialContinents === null;

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
                        {userLocation &&
                          setOffset(userLocation.offset, data.offset)}
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
