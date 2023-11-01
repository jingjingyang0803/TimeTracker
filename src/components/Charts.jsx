import React, { useEffect, useState } from "react";

const Charts = () => {
  const [tasks, setTasks] = useState([]);

  // Initialize `start` state to be the beginning of the current month
  const [start, setStart] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime()
  );
  // Initialize `end` state to be the end of the current day
  const [end, setEnd] = useState(new Date().setHours(23, 59, 59, 999));

  // Fetch tasks from the server on component mount
  useEffect(() => {
    fetch("http://localhost:3010/tasks")
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
      })
      .catch((error) => console.log(error));
  }, []);

  // Filter tasks that are active within the set interval
  const tasksOfInterest = tasks.filter((task) =>
    task.startTime.some((time) => time >= start && time <= end)
  );

  // Handle change of start date
  const handleStartChange = (event) => {
    setStart(new Date(event.target.value).getTime());
  };

  // Handle change of end date
  const handleEndChange = (event) => {
    setEnd(new Date(event.target.value).getTime());
  };

  const formatTime = (timeInMs) => {
    let seconds = Math.floor(timeInMs / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const calculateDailyActiveTime = (task) => {
    const dailyDurations = task.startTime
      .map((startTime, i) => {
        let startOfDay = new Date(startTime).setHours(0, 0, 0, 0);
        let endOfDay = new Date(startTime).setHours(23, 59, 59, 999);
        let stopTime =
          task.isActive && i === task.startTime.length - 1
            ? Date.now()
            : task.stopTime[i];

        if (
          (startTime >= startOfDay && startTime <= endOfDay) ||
          (stopTime >= startOfDay && stopTime <= endOfDay)
        ) {
          let duration =
            Math.min(stopTime, endOfDay) - Math.max(startTime, startOfDay);
          return { day: new Date(startOfDay).toLocaleDateString(), duration };
        }
        return null;
      })
      .filter((day) => day !== null);

    // If the task is active, increase the duration of the last interval
    if (task.isActive) {
      let lastInterval = dailyDurations[dailyDurations.length - 1];
      lastInterval.duration +=
        Date.now() - new Date(lastInterval.day).getTime();
    }

    return dailyDurations;
  };

  return (
    <div>
      <label>
        Start Date:
        <input
          type="date"
          onChange={handleStartChange}
          value={new Date(start).toISOString().substring(0, 10)}
        />
      </label>
      <label>
        End Date:
        <input
          type="date"
          onChange={handleEndChange}
          value={new Date(end).toISOString().substring(0, 10)}
        />
      </label>
      {tasksOfInterest.map((task) => (
        <div key={task.id}>
          <h2>Task: {task.name}</h2>
          {calculateDailyActiveTime(task).map(({ day, duration }, index) => (
            <p key={index}>
              Active Time on {day}: {formatTime(duration)}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Charts;
