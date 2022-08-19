import React from "react";
import { FaTrash, FaEllipsisH, FaPlus } from "react-icons/fa";
import Countdown from "react-countdown";
import Switch from "react-switch";

import { generateId } from "../utils/timeWorld";
import { openHandelAdd, openNav } from "./subsidiaryComp/CardAdd";
import Modal from "./subsidiaryComp/Modal";
import { BottomNav } from "./NavSlde";
import TimerStyle from "./subsidiaryComp/TimerStyle";
import { dragStart, dragEnter, drop } from "./subsidiaryComp/Drog";

import audio from "../alarm.mp3";

const informationUserTime = (setUserTime) => {
  const dateUser = new Date();
  return setUserTime({
    hours: dateUser.getHours(),
    min: dateUser.getMinutes(),
    sec: dateUser.getSeconds(),
  });
};
const SoonerAlarm = (userTime, InitialAlarm) => {
  // get time and alarm && sort them
  const myH = userTime.hours;
  const myM = userTime.min;
  const myS = userTime.sec;
  const soonAlarm = [];
  for (let i = 0; i < InitialAlarm.length; i++) {
    if (InitialAlarm[i].checked) {
      soonAlarm.push({
        hours: +InitialAlarm[i].timeAlarm.split(":")[0],
        min: +InitialAlarm[i].timeAlarm.split(":")[1],
        checked: InitialAlarm[i].checked,
        id: InitialAlarm[i].id,
      });
    }
  }
  soonAlarm.sort((a, b) =>
    a.hours === b.hours ? a.min - b.min : a.hours - b.hours
  );
  // Set time for alarm
  function valueSoonerTime(tomorrow, num) {
    if (tomorrow) {
      return (
        24 * 60 -
        (myH * 60 + myM + myS / 60) +
        (soonAlarm[0].hours * 60 + soonAlarm[0].min)
      );
    } else {
      return (
        -(myH * 60 + myM + myS / 60) +
        (soonAlarm[num].hours * 60 + soonAlarm[num].min)
      );
    }
  }
  //
  if (soonAlarm.length > 0) {
    if (soonAlarm.every((data) => myH > data.hours)) {
      return valueSoonerTime(true, 0);
    } else {
      for (let i = 0; i < soonAlarm.length; i++) {
        let number = soonAlarm.length - 1;
        if (
          soonAlarm[i].hours > myH ||
          (soonAlarm[i].hours === myH && soonAlarm[i].min > myM)
        ) {
          return valueSoonerTime(false, i);
        }
        if (
          soonAlarm[i].hours > myH ||
          (soonAlarm[i].hours === myH && soonAlarm[i].min < myM)
        ) {
          return i === number
            ? valueSoonerTime(true, 0)
            : valueSoonerTime(false, i + 1);
        }
        if (soonAlarm[i].hours === myH && soonAlarm[i].min === myM) {
          return 5 / 60;
        }
      }
    }
  } else {
    return -1;
  }
};

export default function Alarm() {
  const [userTime, setUserTime] = React.useState(null);
  const [InitialAlarm, setInitialAlarm] = React.useState(null);
  const ref = React.useRef();
  const dragItem = React.useRef();
  const dragOverItem = React.useRef();

  React.useEffect(() => {
    informationUserTime(setUserTime);
    setInitialAlarm([
      {
        timeAlarm: "7:00",
        checked: false,
        id: generateId(),
      },
      {
        timeAlarm: "6:30",
        checked: true,
        id: generateId(),
      },
    ]);
  }, []);

  function handelDelete(data) {
    const id = InitialAlarm.findIndex((d) => d.id === data.id);
    setInitialAlarm((d) => [...d.slice(0, id), ...d.slice(id + 1, d.length)]);
  }
  const handleChange = (id) => {
    informationUserTime(setUserTime);
    const number = InitialAlarm.findIndex((d) => d.id === id);
    const copy = Object.assign([], InitialAlarm);
    copy[number].checked = !copy[number].checked;
    setInitialAlarm(copy);
  };
  function toggleShowElement(element, act) {
    document.getElementById(`${element}`).style.display = act;
  }
  function handelAdd(e) {
    e.preventDefault();
    toggleShowElement("myModal", "none");
    informationUserTime(setUserTime);
    const time = e.target[0].value;
    setInitialAlarm((d) => [
      { timeAlarm: time, checked: true, id: generateId() },
      ...d,
    ]);
    // document.getElementById("input-time").value = "";
    e.target[0].value = "";
  }
  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <Completionist />;
    } else {
      // Render a countdown
      return (
        <span>
          Alarm in <TimerStyle time={hours} /> : <TimerStyle time={minutes} /> :{" "}
          <TimerStyle time={seconds} />
        </span>
      );
    }
  };
  const Completionist = () => {
    ringer();
    return (
      <div className="audio">
        <h3 className="ring">Ring</h3>
        <audio src={audio} autoPlay loop controls></audio>
      </div>
    );
  };
  const ringer = () => {
    const dateUser = new Date();
    setTimeout(() => {
      setUserTime({
        hours: dateUser.getHours(),
        min: dateUser.getMinutes() + 1,
        sec: dateUser.getSeconds(),
      });
      ref.current.getApi().start();
    }, [30000]);
  };
  return (
    <React.Fragment>
      <div className="card" id="main">
        {userTime && InitialAlarm && InitialAlarm?.length === 0 && (
          <h2 style={{ paddingBottom: "15px" }}>No Alarm</h2>
        )}
        {userTime && InitialAlarm && InitialAlarm?.length > 0 && (
          <div className="card-title">
            <h2>
              {SoonerAlarm(userTime, InitialAlarm) === -1 && (
                <div>
                  <h3>All alarms is off</h3>
                </div>
              )}
              {SoonerAlarm(userTime, InitialAlarm) >= 0 && (
                <Countdown
                  date={
                    Date.now() + SoonerAlarm(userTime, InitialAlarm) * 60 * 1000
                  }
                  renderer={renderer}
                  ref={(e) => (ref.current = e)}
                />
              )}
            </h2>
          </div>
        )}
        <div className="card-body">
          <div className="card-body-title">
            <h3>Alarm</h3>
            <div className="card-add">
              <FaEllipsisH onClick={openNav} />
            </div>
          </div>
          <ul>
            {InitialAlarm &&
              InitialAlarm?.length > 0 &&
              InitialAlarm.map((data, index) => {
                return (
                  <li
                    className="cardly"
                    key={data.id}
                    draggable
                    onDragStart={() => dragStart(dragItem, index)}
                    onDragEnter={() => dragEnter(dragOverItem, index)}
                    onDragEnd={() =>
                      drop(
                        InitialAlarm,
                        setInitialAlarm,
                        dragItem,
                        dragOverItem
                      )
                    }
                  >
                    <div>
                      <p>{data.timeAlarm}</p>
                    </div>
                    <div>
                      <Switch
                        onChange={() => handleChange(data.id)}
                        checked={data.checked}
                      />
                    </div>
                    <div>
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
        <div className="card-add_alarm">
          <FaPlus onClick={openHandelAdd} />
        </div>
        <BottomNav />
      </div>
      <Modal handelAdd={handelAdd} Alarm={true} />
    </React.Fragment>
  );
}
