import React, { useEffect, useState } from "react";

const Interval = () => {
  const [tasks, setTasks] = useState([]);

  // Initialize `start` state to be the beginning of the current day (midnight)
  const [start, setStart] = useState(new Date().setHours(0, 0, 0, 0));
  // Initialize `end` state to be the current date and time
  const [end, setEnd] = useState(Date.now());

  const [isEndTimeSet, setIsEndTimeSet] = useState(false);

  // Fetch tasks from the server on component mount
  useEffect(() => {
    fetch("http://localhost:3010/tasks")
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (!isEndTimeSet) {
      const interval = setInterval(() => {
        setEnd(Date.now());
      }, 1000); // update every second

      return () => clearInterval(interval); // clear interval on component unmount
    } // Add this line
  }, [isEndTimeSet]); // Add `isEndTimeSet` as a dependency

  // First, calculate tasks of interest
  const tasksOfInterest = tasks.filter((task) =>
    task.startTime.some((time) => time >= start && time <= end)
  );

  const handleStartChange = (event) => {
    setStart(new Date(event.target.value).getTime());
  };

  const handleEndChange = (event) => {
    setIsEndTimeSet(true); // Add this line
    setEnd(new Date(event.target.value).getTime());
  };

  const calculateActiveIntervals = (task) => {
    return task.startTime
      .map((startTime, i) => {
        if (
          (startTime >= start && startTime <= end) ||
          (task.stopTime[i] >= start && task.stopTime[i] <= end)
        ) {
          let intervalStart = Math.max(start, startTime);
          let intervalEnd =
            task.isActive && i === task.startTime.length - 1
              ? Math.min(end, Date.now())
              : Math.min(end, task.stopTime[i]);
          return { start: intervalStart, end: intervalEnd };
        }
        return null;
      })
      .filter((interval) => interval !== null);
  };

  return (
    <div>
      <ul>
        <li>
          This view is designed to display tasks within a specified time
          interval. At the top, you'll find options to manually set the start
          and end times for this interval. Once you adjust these times, the view
          will update to show only the tasks that were active during this
          period.
        </li>
        <li>
          Each listed task includes its active intervals within the chosen time
          frame. An active interval is a period when the task was ongoing. The
          start and end times of these active intervals are adjusted according
          to the overall interval you set.
        </li>
        <li>
          This view is dynamic. It fetches tasks from the server when it loads
          and updates the end time of the interval every second, keeping your
          task list current and precise.
        </li>
      </ul>
      <hr />
      <h3>
        Task details interval: {new Date(start).toLocaleString()} to{" "}
        {new Date(end).toLocaleString()}
      </h3>
      <label>
        Start Time: <input type="datetime-local" onChange={handleStartChange} />
      </label>
      <br />
      <br />
      <label>
        End Time: <input type="datetime-local" onChange={handleEndChange} />
      </label>
      <hr />
      {tasksOfInterest.map((task) => (
        <div key={task.id}>
          <h2>Task: {task.name}</h2>
          Active Interval List:
          {calculateActiveIntervals(task).map((interval, i) => (
            <p key={i}>
              {i + 1}. {new Date(interval.start).toLocaleString()} -{" "}
              {new Date(interval.end).toLocaleString()}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Interval;
