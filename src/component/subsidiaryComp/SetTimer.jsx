import React, { useEffect } from "react";

export let timeSaver;
// export let timeSaver;
export default function SetTimer({
  timeState,
  needSec,
  increase = true,
  StopWatch = 1000,
}) {
  const [hours, setHours] = React.useState(+timeState.split(":")[0] || 0);
  const [minutes, setMinutes] = React.useState(+timeState.split(":")[1]);
  const [seconds, setSeconds] = React.useState(+timeState.split(":")[2]);
  // const saveTime = React.useRef(0);

  useEffect(() => {
    let interval;
    //////////////////////////////////////////////////
    if (increase) {
      interval = setInterval(() => {
        if (seconds > 58) {
          setSeconds(0);
          setMinutes((t) => t + 1);
          if (minutes > 58) {
            setMinutes(0);
            setHours((t) => t + 1);
            if (hours > 22) setHours(0);
          }
        } else {
          StopWatch === 1000
            ? setSeconds((t) => t + 1)
            : setSeconds((t) => t + 0.01);
        }
        timeSaver = {
          sec: seconds.toFixed(2),
          min: minutes,
        };
      }, [StopWatch]);
    } else {
      interval = setInterval(() => {
        if (seconds < 1) {
          setSeconds(59);
          setMinutes((t) => t - 1);
          if (minutes < 1) {
            setMinutes(59);
            setHours((t) => t - 1);
            if (hours < 1) setHours(0);
          }
        } else {
          setSeconds((t) => t - 1);
        }
        timeSaver = {
          sec: seconds,
          min: minutes,
          hours: hours,
        };
      }, [StopWatch]);
    }
    return () => clearInterval(interval);
  }, [seconds, minutes, hours, increase, StopWatch]);
  return (
    <>
      {StopWatch === 1000 && (
        <React.Fragment>
          {hours < 10 ? "0" + hours : hours} :{" "}
          {minutes < 10 ? "0" + minutes : minutes}
          {needSec && <span> : {seconds < 10 ? "0" + seconds : seconds}</span>}
        </React.Fragment>
      )}
      {StopWatch === 10 && (
        <React.Fragment>
          {minutes < 10 ? "0" + minutes : minutes}:
          {seconds < 10 ? "0" + seconds.toFixed(2) : seconds.toFixed(2)}
        </React.Fragment>
      )}
    </>
  );
}
