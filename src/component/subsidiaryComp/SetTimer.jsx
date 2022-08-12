import React, { useEffect } from "react";
import TimerStyle from "./TimerStyle";

export let timeSaver;
export default function SetTimer({ timeState, needSec, StopWatch = 1000 }) {
  const [hours, setHours] = React.useState(+timeState.split(":")[0] || 0);
  const [minutes, setMinutes] = React.useState(+timeState.split(":")[1]);
  const [seconds, setSeconds] = React.useState(+timeState.split(":")[2]);
  useEffect(() => {
    const interval = setInterval(() => {
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
    return () => clearInterval(interval);
  }, [seconds, minutes, hours, StopWatch]);
  return (
    <>
      {StopWatch === 1000 && (
        <React.Fragment>
          <TimerStyle time={hours} /> : <TimerStyle time={minutes} />
          {needSec && (
            <span>
              {" "}
              : <TimerStyle time={seconds} />
            </span>
          )}
        </React.Fragment>
      )}
      {StopWatch === 10 && (
        <React.Fragment>
          <TimerStyle time={minutes} />:
          <TimerStyle time={seconds} toFixed={true} />
        </React.Fragment>
      )}
    </>
  );
}
