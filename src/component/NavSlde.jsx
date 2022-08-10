import React from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaRegClock, FaMoon, FaSun } from "react-icons/fa";
import { BsAlarm, BsStopwatch } from "react-icons/bs";
import { IoTimerOutline } from "react-icons/io5";

export default function NavSide() {
  const [theme, setTheme] = React.useState("light");
  const toggleTheme = () => setTheme((d) => (d === "light" ? "dark" : "light"));
  //
  function onThemeToggle(theme) {
    const data = {
      "--color-background": { light: "#e7e7e7", dark: "#5d666d" },
      "--color-text": { light: "#646e82", dark: "#e7e7e7" },
      "--color-box_shadow-dark": { light: "#a5a5a5", dark: "#4f575d" },
      "--color-box_shadow-light": { light: "#ffffff", dark: "#6b757d" },
      "--color-card-title-h2": { light: "#333", dark: "#ffffff" },
    };
    for (let key in data) {
      document.documentElement.style.setProperty(
        key,
        theme === "light" ? data[key].light : data[key].dark
      );
    }
  }
  React.useEffect(() => {
    onThemeToggle(theme);
  }, [theme]);
  const { pathname } = useLocation();
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
  }
  return (
    <div id="mySidenav" className="sidenav">
      <button className="togglebtn" onClick={toggleTheme}>
        {theme === "light" && (
          <span>
            <FaMoon /> Dark
          </span>
        )}
        {theme === "dark" && (
          <span>
            <FaSun /> Light
          </span>
        )}
      </button>
      <button className="closebtn" onClick={closeNav}>
        &times;
      </button>
      <Link
        className={pathname === "/alarm" ? `active-side-${theme}` : ""}
        to="/alarm"
      >
        <BsAlarm /> Alarm
      </Link>
      <Link className={pathname === "/" ? `active-side-${theme}` : ""} to="/">
        <FaRegClock /> WordClock
      </Link>
      <Link
        className={pathname === "/stopwatch" ? `active-side-${theme}` : ""}
        to="/stopwatch"
      >
        <BsStopwatch /> Stopwatch
      </Link>
      <Link
        className={pathname === "/timer" ? `active-side-${theme}` : ""}
        to="/timer"
      >
        <IoTimerOutline /> Timer
      </Link>
    </div>
  );
}
export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <div className="navbar">
      <Link className={pathname === "/alarm" ? "active-nav" : ""} to="/alarm">
        <BsAlarm />
      </Link>
      <Link className={pathname === "/" ? "active-nav" : ""} to="/">
        <FaRegClock />
      </Link>
      <Link
        className={pathname === "/stopwatch" ? "active-nav" : ""}
        to="/stopwatch"
      >
        <BsStopwatch />
      </Link>
      <Link className={pathname === "/timer" ? "active-nav" : ""} to="/timer">
        <IoTimerOutline />
      </Link>
    </div>
  );
}
