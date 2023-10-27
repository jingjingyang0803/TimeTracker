import React, { useState } from "react";

const Settings = ({ theme, setTheme }) => {
  const [singleTaskMode, setSingleTaskMode] = useState(false);

  const handleThemeChange = () => {
    setTheme(theme === "default" ? "dark" : "default");
  };

  const toggleSingleTaskMode = () => {
    setSingleTaskMode((prevState) => !prevState);
  };

  return (
    <div>
      <ul>
        <li>
          <b>Change the theme of the application: </b> In the "Settings" view,
          you can select a different theme for the application. This would
          affect the UI colors and provide a different visual experience.
        </li>
        <li>
          <b>Change the application mode: </b> In the "Settings" view, you can
          switch between the default mode and an alternative mode.
          <p>
            In the default mode, multiple tasks can be active at the same time.
            Activating a task does not inactivate other tasks.
          </p>
          <p>
            In the alternative mode, only one task can be active at a time.
            Activating a task automatically inactivates any other active tasks.
          </p>
        </li>
        <li>
          The settings are stored using the API provided by json-server, and the
          application starts with the most recently set configuration after
          submission.
        </li>
      </ul>

      <hr />

      <div>
        <button onClick={handleThemeChange}>
          {theme === "default"
            ? "Change to Dark Theme"
            : "Change to Default Theme"}
        </button>
        <br />
        <br />
        <button onClick={toggleSingleTaskMode}>
          {singleTaskMode
            ? "Disable Single Task Mode"
            : "Enable Single Task Mode"}
        </button>
      </div>
    </div>
  );
};

export default Settings;
