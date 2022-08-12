import React from "react";

const timer = function (el, e, time) {
  let i = 0;
  const interval = setInterval(function () {
    if (el) el.style.transform = `rotate(${time + i + 180}deg) `;
    i = i + 360 / e;
    if (i >= 360) i = 0;
  }, 1000);
  return () => clearInterval(interval);
};
export default function ClockStyle({ timeState }) {
  const [state, setState] = React.useState(null);
  const [time, setTime] = React.useState();
  React.useEffect(() => {
    setTime({
      hours:
        (+timeState.split(":")[0] / 12) * 360 +
        (+timeState.split(":")[1] / 60) * 30 +
        90,
      min:
        (+timeState.split(":")[1] / 60) * 360 +
        ((+timeState.split(":")[2] + 14) / 60) * 6 +
        90,
      sec: ((+timeState.split(":")[2] + 14) / 60) * 360 + 9,
    });
    setState({
      H: document.querySelector(".hours"),
      M: document.querySelector(".min"),
      S: document.querySelector(".sec"),
    });
  }, [timeState]);
  if (state) {
    timer(state.S, 60, time.sec);
    timer(state.M, 60 * 60, time.min);
    timer(state.H, 60 * 60 * 12, time.hours);
  }
  return (
    <div className="clock-style">
      <div className="ellipse">
        <div className="rectangle"></div>
        <div className="markings"></div>
        <div className="hands">
          <div className="hours time"></div>
          <div className="min time"></div>
          <div className="sec time"></div>
        </div>
      </div>
    </div>
  );
}
