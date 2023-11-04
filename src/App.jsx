import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";

import About from "./components/About";
import Tasks from "./components/Tasks";
import Summary from "./components/Summary";
import Interval from "./components/Interval";
import Intervals from "./components/Intervals";
import Charts from "./components/Charts";
import Settings from "./components/Settings";

import "./App.css";

const NavigationBar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">About</Link> {/* Link to the About page */}
        </li>
        <li>
          <Link to="/tasks">Task Management</Link>{" "}
          {/* Link to the Tasks page */}
        </li>
        <li>
          <Link to="/summary">Summary</Link> {/* Link to the Summary page */}
        </li>
        <li>
          <Link to="/interval">Interval</Link> {/* Link to the Interval page */}
        </li>
        <li>
          <Link to="/intervals">Intervals</Link>{" "}
          {/* Link to the Interval page */}
        </li>
        <li>
          <Link to="/charts">Charts</Link> {/* Link to the Charts page */}
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
            <Route path="/summary" element={<Summary />} />{" "}
            {/* Route for the Summary page */}
            <Route path="/interval" element={<Interval />} />{" "}
            {/* Route for the Interval page */}
            <Route path="/intervals" element={<Intervals />} />{" "}
            {/* Route for the Intervals page */}
            <Route path="/charts" element={<Charts />} />{" "}
            {/* Route for the Charts page */}
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
