import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";

import Loading from "./component/subsidiaryComp/Loading";

import NavSide from "./component/NavSlde";
const Clocks = React.lazy(() => import("./component/Clocks"));
const Alarm = React.lazy(() => import("./component/Alarm"));
const Stopwatch = React.lazy(() => import("./component/StopWatch"));
const Timer = React.lazy(() => import("./component/Timer"));

function App() {
  return (
    <Router>
      <NavSide />
      <React.Suspense
        fallback={
          <div style={{ textAlign: "center", paddingTop: "25%" }}>
            <Loading />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Clocks />} />
          <Route path="/alarm" element={<Alarm />} />
          <Route path="/stopwatch" element={<Stopwatch />} />
          <Route path="/timer" element={<Timer />} />
          <Route
            path="*"
            element={
              <h1 style={{ textAlign: "center", paddingTop: "25%" }}>
                Page not found
              </h1>
            }
          />
        </Routes>
      </React.Suspense>
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
