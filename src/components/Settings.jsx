import React, { useEffect } from "react";

const Settings = ({ theme, setTheme, singleTaskMode, setSingleTaskMode }) => {
  useEffect(() => {
    // fetch settings from the server when the component mounts
    fetch("http://localhost:3010/settings")
      .then((response) => response.json())
      .then((data) => {
        setTheme(data.theme); // update theme state with fetched data
        setSingleTaskMode(data.singleMode); // update singleTaskMode state with fetched data
      });
  }, []); // empty dependency array means this effect runs once when the component mounts

  // ================================= toggle theme/mode =========================================================
  const handleThemeChange = () => {
    const newTheme = theme === "default" ? "dark" : "default"; // toggle theme
    setTheme(newTheme); // update theme state
    saveSettingsToServer({ theme: newTheme, singleMode: singleTaskMode }); // save new settings to the server
  };

  const toggleSingleTaskMode = () => {
    const newMode = !singleTaskMode; // toggle mode
    setSingleTaskMode(newMode); // update singleTaskMode state
    saveSettingsToServer({ theme: theme, singleMode: newMode }); // save new settings to the server
  };

  // ================================= Save Settings To Server ===================================================
  const saveSettingsToServer = (settings) => {
    fetch("http://localhost:3010/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings), // convert JavaScript object into a JSON string
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Settings saved successfully:", data); // log success message
      })
      .catch((error) => {
        console.error("Failed to save settings:", error); // log error message
      });
  };

  // ================================= return ====================================================================
  return (
    <div>
      <ul>
        <li>
          <u>Change the theme of the application: </u> You can toggle between
          the default and dark themes by clicking on the button labeled either
          "Change to Dark Theme" or "Change to Default Theme". This will affect
          the UI colors and provide a different visual experience.
        </li>
        <li>
          <u>Change the application mode: </u> You can choose the application
          mode by clicking on the button labeled either "Disable Single Task
          Activation Mode" or "Enable Single Task Activation Mode".
          <p>
            In the default mode, multiple tasks can be active at the same time.
            Activating a task does not inactivate other tasks.
          </p>
          <p>
            When "Single Task Activation Mode" is enabled, only one task can be
            active at a time. Activating a task automatically inactivates any
            other active tasks.
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
        {/* Button to switch themes */}
        <button onClick={handleThemeChange} className="theme-button">
          {/* Text displayed when the current theme is/is not "default" */}
          {theme === "default"
            ? "Change to Dark Theme"
            : "Change to Default Theme"}{" "}
        </button>

        {/* Button to toggle single task activation mode */}
        <button onClick={toggleSingleTaskMode} className="mode-button">
          {/* Text displayed when single task activation mode is disabled/enabled */}
          {singleTaskMode
            ? "Disable Single Task Activation Mode"
            : "Enable Single Task Activation Mode"}{" "}
        </button>
      </div>
    </div>
  );
};

export default Settings;
