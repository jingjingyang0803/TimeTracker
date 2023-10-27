import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";

import About from "./components/About";
import Tasks from "./components/Tasks";
import Tags from "./components/Tags";
import Summary from "./components/Summary";
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
          <Link to="/tags">Tags</Link> {/* Link to the Tags page */}
        </li>
        <li>
          <Link to="/summary">Summary and Charts</Link>{" "}
          {/* Link to the Summary page */}
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
            <Route path="/tags" element={<Tags />} />{" "}
            {/* Route for the Tags page */}
            <Route path="/summary" element={<Summary />} />{" "}
            {/* Route for the Summary page */}
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
