import React from "react";
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
          <Link to="/">About</Link>
        </li>
        <li>
          <Link to="/tasks">Task Management</Link>
        </li>
        <li>
          <Link to="/tags">Tags</Link>
        </li>
        <li>
          <Link to="/summary">Summary and Charts</Link>
        </li>
        <li>
          <Link to="/settings">Settings</Link>
        </li>
      </ul>
    </nav>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <div className="container">
        <header>
          <h1>Time Tracker</h1>
          <NavigationBar />
        </header>
        <main>
          <Routes>
            <Route exact path="/" element={<About />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/tags" element={<Tags />} />
            <Route path="/summary" element={<Summary />} />
            <Route path="/settings" element={<Settings />} />
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
