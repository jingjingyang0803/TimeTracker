import React, { useState } from "react";

import TotalActiveTime from "./TotalActiveTime";
import ActiveIntervals from "./ActiveIntervals";
import Timeline from "./Timeline";
import DailyActiveChart from "./DailyActiveChart";

const componentMap = {
  TotalActiveTime,
  ActiveIntervals,
  Timeline,
  DailyActiveChart,
};

const Durations = [
  { label: "Component 1", name: "TotalActiveTime" },
  { label: "Component 2", name: "ActiveIntervals" },
  { label: "Component 3", name: "Timeline" },
  { label: "Component 4", name: "DailyActiveChart" },
];

const TimeUsage = () => {
  const [activeComponent, setActiveComponent] = useState(null);

  const renderComponent = (componentName) => {
    const selectedComponent = componentMap[componentName];
    setActiveComponent(selectedComponent);
  };

  return (
    <div>
      {Durations.map((item, index) => (
        <button key={index} onClick={() => renderComponent(item.name)}>
          {item.label}
        </button>
      ))}
      {activeComponent}
    </div>
  );
};

export default TimeUsage;
