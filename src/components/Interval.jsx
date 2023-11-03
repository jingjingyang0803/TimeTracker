import React, { useEffect, useState } from "react";

const Interval = () => {
  // ================================= useState and useEffect ====================================================
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

  // ================================= Set Task details interval ==================================================
  // Handle the change in the start time of the observation interval
  const handleStartChange = (event) => {
    // Convert the date from the input field to a timestamp and update the start state
    setStart(new Date(event.target.value).getTime());
  };

  // Handle the change in the end time of the observation interval
  const handleEndChange = (event) => {
    // Set the flag that indicates that the end time has been set by the user
    setIsEndTimeSet(true); // Add this line
    // Convert the date from the input field to a timestamp and update the end state
    setEnd(new Date(event.target.value).getTime());
  };

  // ================================= calculate Active Intervals ================================================
  // Filter the tasks that are of interest, i.e., those that have at least one start time within the observation interval
  const tasksOfInterest = tasks.filter((task) =>
    task.startTime.some((time) => time >= start && time <= end)
  );
  // Calculate the active intervals of a task within the observation interval
  const calculateActiveIntervals = (task) => {
    // Map over each start time of the task
    return (
      task.startTime
        .map((startTime, i) => {
          // Check if the start time or the corresponding stop time is within the observation interval
          if (
            (startTime >= start && startTime <= end) ||
            (task.stopTime[i] >= start && task.stopTime[i] <= end)
          ) {
            // If so, calculate the start and end of the active interval within the observation interval
            let intervalStart = Math.max(start, startTime);
            let intervalEnd =
              task.isActive && i === task.startTime.length - 1
                ? // If the task is currently active and this is the last start time, the end of the interval is either the current time or the end of the observation interval, whichever is smaller
                  Math.min(end, Date.now())
                : // Otherwise, the end of the interval is either the corresponding stop time or the end of the observation interval, whichever is smaller
                  Math.min(end, task.stopTime[i]);
            // Return the active interval
            return { start: intervalStart, end: intervalEnd };
          }
          // If the start time and the corresponding stop time are both outside the observation interval, return null
          return null;
        })
        // Filter out any null values resulting from start times and stop times outside the observation interval
        .filter((interval) => interval !== null)
    );
  };

  // ================================= return ====================================================================
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
        {/* Displaying the task details interval with start and end dates */}
        Task details interval: {new Date(start).toLocaleString()} to{" "}
        {new Date(end).toLocaleString()}
      </h3>
      <label>
        {/* Input field for setting the Start Time */}
        Start Time:{" "}
        <input type="datetime-local" step="1" onChange={handleStartChange} />
      </label>
      <br />
      <br />
      <label>
        {/* Input field for setting the End Time */}
        End Time:{" "}
        <input type="datetime-local" step="1" onChange={handleEndChange} />
      </label>

      <hr />

      {/* Loop through tasks of interest and display each task with its details */}
      {tasksOfInterest.map((task) => (
        <div key={task.id}>
          <h2>Task: {task.name}</h2>
          Active Interval List:
          {/* Calculate and display active intervals for each task */}
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
