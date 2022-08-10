import React from "react";
import { FaEllipsisH, FaPlay, FaPause, FaStop, FaSync } from "react-icons/fa";

import { BottomNav } from "./NavSlde";
import { openNav } from "./subsidiaryComp/CardAdd";
import SetTimer, { timeSaver } from "./subsidiaryComp/SetTimer";

export default function StopWatch() {
  const [state, setState] = React.useState(
    setStateValue("start", "lap", false, true)
  );
  const [overallTime, setOverallTime] = React.useState([]);
  const [lapTime, setLapTime] = React.useState([]);
  const [time, setTime] = React.useState("00:00.00");
  const sv = React.useRef();
  function handelStart() {
    const seterTime = {
      sec: +timeSaver?.sec - sv.current?.sec,
      min: +timeSaver?.min - sv.current?.min,
    };
    sv.current = {
      sec: 0,
      min: 0,
    };
    setTime(seterTime);
    const start = state.start === true ? false : true;
    switch (state.run) {
      case "start":
        return setState(setStateValue("pause", "lap", start, false));
      case "pause":
        return setState(setStateValue("resume", "reset", start, false));
      case "resume":
        return setState(setStateValue("pause", "lap", start, false));
      default:
        return console.error("error");
    }
  }
  function handelLap() {
    switch (state.lap) {
      case "lap":
        setOverallTime((d) => [timeSaver, ...d]);
        let stateSec = 0;
        let stateMin = 0;
        lapTime.forEach((data) => {
          stateSec = stateSec + data.sec;
          stateMin = stateMin + data.min;
        });
        return setLapTime((d) => [
          {
            sec: +Number.parseFloat(+timeSaver.sec - stateSec).toFixed(2),
            min: +timeSaver?.min - stateMin,
          },
          ...d,
        ]);
      case "reset":
        setState(setStateValue("start", "lap", false, true));
        setOverallTime([]);
        setLapTime([]);
        sv.current = {
          min: timeSaver.min,
          sec: timeSaver.sec,
        };
        return setTime("00:00.00");
      default:
        console.error("error");
    }
  }
  function setStateValue(run, lap, start, btnDisable) {
    return {
      run: run,
      lap: lap,
      start: start,
      btnDisable: btnDisable,
    };
  }
  return (
    <React.Fragment>
      <div className="card" id="main">
        <div className="card-title">
          <h2>
            {state.start === false && (
              <>
                {time?.min < 10 ? "0" + time?.min : time?.min || "00"}:
                {time?.sec < 10 ? "0" + time?.sec : time?.sec || "00.00"}
              </>
            )}
            {state.start === true && (
              <SetTimer
                timeState={`00:${time?.min || 0}:${time?.sec || 0}`}
                needSec={false}
                StopWatch={10}
              />
            )}
          </h2>
        </div>
        <div className="card-body">
          <div className="card-body-title">
            <h3>Stopwatch</h3>
            <div className="card-add">
              <FaEllipsisH onClick={openNav} />
            </div>
          </div>
          <div className="card-body-table">
            <p>Lap</p>
            <p>Lap times</p>
            <p>Overall time</p>
          </div>
          <ul>
            {overallTime.length > 0 &&
              lapTime.length > 0 &&
              overallTime.map((data, index) => {
                return (
                  <li
                    className={"cardly"}
                    key={data.sec}
                    style={
                      index % 2 === 0
                        ? {
                            background: "#646e82",
                            color: "#e7e7e7",
                            padding: "5px 0",
                          }
                        : {
                            background: "#e7e7e7",
                            color: "#646e82",
                            padding: "5px 0",
                          }
                    }
                  >
                    <h3>{overallTime.length - index}</h3>
                    <p>
                      {lapTime[index].min > 10
                        ? lapTime[index].min
                        : "0" + lapTime[index].min}
                      :
                      {lapTime[index].sec > 10
                        ? lapTime[index].sec
                        : "0" + lapTime[index].sec}
                    </p>
                    <p>
                      {data.min > 10 ? data.min : "0" + data.min}:
                      {data.sec > 10 ? data.sec : "0" + data.sec}
                    </p>
                  </li>
                );
              })}
          </ul>
        </div>
        <div className="footer-btn">
          <button
            className="btn lap lap_btn"
            onClick={handelLap}
            disabled={state.btnDisable}
            style={
              state.btnDisable === true ? { opacity: "0.4" } : { opacity: "1" }
            }
          >
            {state.lap === "lap" && <FaStop />}
            {state.lap === "reset" && <FaSync />}
          </button>
          <button className="btn stop-watch_btn start" onClick={handelStart}>
            {state.run === "start" && <FaPlay />}
            {state.run === "pause" && <FaPause />}
            {state.run === "resume" && <FaPlay />}
          </button>
        </div>
        <BottomNav />
      </div>
    </React.Fragment>
  );
}
