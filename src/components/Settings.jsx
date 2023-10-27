import React, { useEffect } from "react";

const Settings = ({ theme, setTheme, singleTaskMode, setSingleTaskMode }) => {
  useEffect(() => {
    // fetch settings from the server when the component mounts
    fetch("http://localhost:3010/settings")
      .then((response) => response.json())
      .then((data) => {
        setTheme(data.theme);
        setSingleTaskMode(data.singleMode);
      });
  }, []); // empty dependency array means this effect runs once when the component mounts

  const handleThemeChange = () => {
    const newTheme = theme === "default" ? "dark" : "default";
    setTheme(newTheme);
    saveSettingsToServer({ theme: newTheme, singleMode: singleTaskMode });
  };

  const toggleSingleTaskMode = () => {
    const newMode = !singleTaskMode;
    setSingleTaskMode(newMode);
    saveSettingsToServer({ theme: theme, singleMode: newMode });
  };

  const saveSettingsToServer = (settings) => {
    fetch("http://localhost:3010/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Settings saved successfully:", data);
      })
      .catch((error) => {
        console.error("Failed to save settings:", error);
      });
  };

  return (
    <div>
      <ul>
        <li>
          <b>Change the theme of the application: </b> You can toggle between
          the default and dark themes by clicking on the button labeled either
          "Change to Dark Theme" or "Change to Default Theme". This will affect
          the UI colors and provide a different visual experience.
        </li>
        <li>
          <b>Change the application mode: </b> You can choose the application
          mode by clicking on the button labeled either "Disable Single Task
          Mode" or "Enable Single Task Mode".
          <p>
            In the default mode, multiple tasks can be active at the same time.
            Activating a task does not inactivate other tasks.
          </p>
          <p>
            When "Single Task Mode" is enabled, only one task can be active at a
            time. Activating a task automatically inactivates any other active
            tasks.
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
