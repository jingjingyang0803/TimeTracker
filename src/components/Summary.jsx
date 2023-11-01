import React, { useEffect, useState } from "react";

const Summary = () => {
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

  // Calculate the total active time of each task by summing up the durations of all activity periods within the observation interval
  const formatTime = (timeInMs) => {
    // These durations are then summed up to give the total active time of the task within the observation interval.
    let seconds = Math.floor(timeInMs / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const calculateActiveTime = (task) => {
    // The function calculates the total active time of each task within a specified observation interval (from `start` to `end`).
    return task.startTime.reduce((total, startTime, i) => {
      // `startTime` and `i` are the elements and indices of the `task.startTime` array respectively, while `total` is the accumulator that collects the sum of all durations.
      if (
        (startTime >= start && startTime <= end) ||
        (task.stopTime[i] >= start && task.stopTime[i] <= end)
      ) {
        // The `if` condition checks whether the start time or stop time of any activity period falls within the observation interval.
        let duration =
          task.isActive && i === task.startTime.length - 1
            ? // If the task is currently active (i.e., `task.isActive` is `true`) and the current start time is the last one in the `task.startTime` array (`i === task.startTime.length - 1`), the duration is calculated as the difference between the current time (`Date.now()`) and the largest of the start time and the start of the observation interval (`Math.max(startTime, start)`).
              Date.now() - Math.max(startTime, start)
            : // For all other activity periods, the duration is calculated as the difference between the smallest of the stop time and the end of the observation interval (`Math.min(task.stopTime[i], end)`) and the largest of the start time and the start of the observation interval (`Math.max(startTime, start)`).
              Math.min(task.stopTime[i], end) - Math.max(startTime, start);
        return total + duration;
      }
      return total;
    }, 0);
  };

  // Calculate tags of interest directly in the component's body
  const allTags = tasksOfInterest.reduce((acc, task) => {
    return [...acc, ...task.tags];
  }, []);
  const uniqueTags = [...new Set(allTags)];

  const tagsOfInterest = uniqueTags.map((tag) => {
    const tasksWithThisTag = tasksOfInterest.filter((task) =>
      task.tags.includes(tag)
    );
    const activeTimeForTag = tasksWithThisTag.reduce((total, task) => {
      return total + calculateActiveTime(task);
    }, 0);
    return { tag, activeTime: activeTimeForTag }; // Use formatTime here
  });

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
          <b>Viewing Summaries: </b>Navigate to the "Summary" section to see the
          total active times for tasks and tags within a specified observation
          interval.
        </li>
        <li>
          <b>Analyzing with Charts: </b>Go to the "Charts" section to view bar
          charts displaying daily activity times for selected tasks.
        </li>
      </ul>
      <hr />
      <br />
      <h4>
        Observation interval: {new Date(start).toLocaleString()} to{" "}
        {new Date(end).toLocaleString()}
      </h4>
      <label>
        Start Time:
        <input type="datetime-local" onChange={handleStartChange} />
      </label>
      <label>
        End Time:
        <input type="datetime-local" onChange={handleEndChange} />
      </label>
      {tasksOfInterest.map((task) => (
        <div key={task.id}>
          <h2>Task: {task.name}</h2>
          <p>Tags: {task.tags.join(", ")}</p>
          {calculateActiveIntervals(task).map((interval, i) => (
            <p key={i}>
              Active Interval {i + 1}:{" "}
              {new Date(interval.start).toLocaleString()} -{" "}
              {new Date(interval.end).toLocaleString()}
            </p>
          ))}
          <p>Total Active Time: {formatTime(calculateActiveTime(task))}</p>
        </div>
      ))}
      <hr />
      {tagsOfInterest.map((tag) => (
        <div key={tag.tag}>
          <h2>Tag: {tag.tag}</h2>
          <p>Total Active Time: {formatTime(tag.activeTime)}</p>
        </div>
      ))}
    </div>
  );
};

export default Summary;
