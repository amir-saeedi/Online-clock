import React from "react";

export default function TimerStyle({ time, toFixed = false }) {
  if (toFixed) {
    return <>{time < 10 ? "0" + time.toFixed(2) : time.toFixed(2)}</>;
  }
  return <>{time < 10 ? "0" + time : time}</>;
}
