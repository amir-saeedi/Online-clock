import React from "react";
import Countdown from "react-countdown";
import audio from "../alarm.mp3";

import { BottomNav } from "./NavSlde";
import TimeInput from "./subsidiaryComp/inputTimeLibrary/TimeInput";

export default function Timer() {
  const [start, setStart] = React.useState(false);
  const [timer, setTimer] = React.useState(null);
  const input = React.useRef();
  const ref = React.useRef();

  React.useEffect(() => {
    const spinner = document.querySelector(".spinner");
    const filler = document.querySelector(".filler");
    const mask = document.querySelector(".mask");
    if (timer) {
      spinner.style.animation = `rota ${+timer.sec + timer.min * 60}s linear`;
      filler.style.animation = `opa ${
        +timer.sec + timer.min * 60
      }s steps(1, end) reverse`;
      mask.style.animation = `opa ${
        +timer.sec + timer.min * 60
      }s steps(1, end)`;
    }
  }, [timer]);
  function handelStart(e) {
    e.preventDefault();
    if (input.current?.length === 5) {
      setStart(true);
      const time = {
        min: input.current.split(":")[0],
        sec: input.current.split(":")[1],
      };
      setTimer(time);
    }
  }
  function handelStop() {
    ref.current.getApi().isPaused()
      ? ref.current.getApi().start()
      : ref.current.getApi().pause();
  }
  function handelCancel() {
    ref.current.stop();
    setTimer(null);
    input.current = null;
    setStart(false);
  }
  const onBlurHandler = (event) => {
    // console.log("you left ", event.target.value);
  };
  const onTimeChangeHandler = (val) => {
    if (val.length === 5) {
      input.current = val;
    }
  };
  const Completionist = () => {
    return (
      <div className="audio">
        <h3 className="ring">Ring</h3>
        <audio src={audio} autoPlay loop controls></audio>
      </div>
    );
  };
  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <Completionist />;
    } else {
      // Render a countdown
      return (
        <span>
          {hours >= 10 ? hours : "0" + hours}:
          {minutes >= 10 ? minutes : "0" + minutes}:
          {seconds >= 10 ? seconds : "0" + seconds}
        </span>
      );
    }
  };
  const handelPause = () => {
    const spinner = document.querySelector(".spinner");
    const filler = document.querySelector(".filler");
    const mask = document.querySelector(".mask");
    spinner.style["animation-play-state"] = "paused";
    filler.style["animation-play-state"] = "paused";
    mask.style["animation-play-state"] = "paused";
  };
  const handelerStart = () => {
    const spinner = document.querySelector(".spinner");
    const filler = document.querySelector(".filler");
    const mask = document.querySelector(".mask");
    spinner.style["animation-play-state"] = "running";
    filler.style["animation-play-state"] = "running";
    mask.style["animation-play-state"] = "running";
  };

  return (
    <div className="card" id="main">
      {start === false && (
        <React.Fragment>
          <form onSubmit={handelStart}>
            <div className="card-title">
              <h2 style={{ fontFamily: "cursive" }}>SET TIMER</h2>
              <TimeInput
                name="input_time"
                placeholder="11:12"
                className="s-input -time input_time"
                mountFocus="true"
                onTimeChange={onTimeChangeHandler}
                onBlurHandler={onBlurHandler}
                timer={true}
              />
            </div>
            <div>
              <button type="submit" className="btn stop-watch_btn start">
                Start
              </button>
            </div>
          </form>
        </React.Fragment>
      )}
      {start === true && (
        <React.Fragment>
          <div className="card-title">
            <div className="wrapper">
              <div className="pie spinner"></div>
              <div className="pie filler"></div>
              <div className="mask"></div>
            </div>
            <h2>
              <Countdown
                date={Date.now() + timer.min * 60 * 1000 + timer.sec * 1000}
                renderer={renderer}
                ref={(e) => (ref.current = e)}
                onPause={handelPause}
                onStart={handelerStart}
              />
            </h2>
          </div>
          <div className="footer-btn">
            <button className="btn" onClick={handelCancel}>
              Cancel
            </button>
            <button className="btn" onClick={handelStop}>
              Pause
            </button>
          </div>
        </React.Fragment>
      )}
      <BottomNav />
    </div>
  );
}
