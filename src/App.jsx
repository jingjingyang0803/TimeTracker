import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";

import About from "./components/About";
import Tasks from "./components/Tasks";
import TotalActiveTime from "./components/TotalActiveTime";
import ActiveIntervals from "./components/ActiveIntervals";
import Timeline from "./components/Timeline";
import DailyActiveChart from "./components/DailyActiveChart";
import Settings from "./components/Settings";

import "./App.css";

const NavigationBar = () => {
  return (
    <nav className="nav">
      <ul>
        <li>
          <Link to="/">About</Link> {/* Link to the About page */}
        </li>
        <li>
          <Link to="/tasks">Task Management</Link>{" "}
          {/* Link to the Tasks page */}
        </li>
        <li>
          <Link to="/total-active-time">TotalActiveTime</Link>{" "}
          {/* Link to the TotalActiveTime page */}
        </li>
        <li>
          <Link to="/active-intervals">ActiveIntervals</Link>{" "}
          {/* Link to the ActiveIntervals page */}
        </li>
        <li>
          <Link to="/timeline">Timeline</Link> {/* Link to the Timeline page */}
        </li>
        <li>
          <Link to="/daily-active-chart">DailyActiveChart</Link>{" "}
          {/* Link to the DailyActiveChart page */}
        </li>
        <li>
          <Link to="/settings">Settings</Link> {/* Link to the Settings page */}
        </li>
      </ul>
    </nav>
  );
};

const App = () => {
  const [theme, setTheme] = useState("default");
  const themeClass = theme === "default" ? "defaultTheme" : "darkTheme";

  const [singleTaskMode, setSingleTaskMode] = useState(false);

  return (
    <BrowserRouter>
      <div className={`container ${themeClass}`}>
        <header>
          <h1>Time Tracker</h1> {/* Header */}
          <NavigationBar /> {/* Navigation bar */}
        </header>
        <main>
          <Routes>
            <Route exact path="/" element={<About />} />{" "}
            {/* Route for the About page */}
            <Route
              path="/tasks"
              element={<Tasks singleTaskMode={singleTaskMode} />}
            />{" "}
            {/* Route for the Tasks page */}
            <Route
              path="/total-active-time"
              element={<TotalActiveTime />}
            />{" "}
            {/* Route for the TotalActiveTime page */}
            <Route
              path="/active-intervals"
              element={<ActiveIntervals />}
            />{" "}
            {/* Route for the ActiveIntervals page */}
            <Route path="/timeline" element={<Timeline />} />{" "}
            {/* Route for the ActiveIntervalss page */}
            <Route
              path="/daily-active-chart"
              element={<DailyActiveChart />}
            />{" "}
            {/* Route for the DailyActiveChart page */}
            <Route
              path="/settings"
              element={
                <Settings
                  theme={theme}
                  setTheme={setTheme}
                  singleTaskMode={singleTaskMode}
                  setSingleTaskMode={setSingleTaskMode}
                />
              }
            />{" "}
            {/* Route for the Settings page */}
          </Routes>
        </main>
        <footer>
          <p>Copyright © 2023 Jingjing Yang at TAMK</p>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
