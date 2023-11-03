import React, { useEffect, useState } from "react";

const Summary = () => {
  // ================================= useState and useEffect =====================================================
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

  // ================================= Set observation interval ==================================================
  const handleStartChange = (event) => {
    // Convert the start time to milliseconds and update the 'start' state
    setStart(new Date(event.target.value).getTime());
  };

  const handleEndChange = (event) => {
    // Set 'isEndTimeSet' state to true when end time is selected
    setIsEndTimeSet(true);
    // Convert the end time to milliseconds and update the 'end' state
    setEnd(new Date(event.target.value).getTime());
  };

  // ================================= Calculate total Active Time ====================================================================
  // First, calculate tasks of interest
  const tasksOfInterest = tasks.filter((task) =>
    task.startTime.some((time) => time >= start && time <= end)
  );

  // This function takes a time duration in milliseconds as input and returns the time formatted as hours, minutes, and seconds.
  const formatTime = (timeInMs) => {
    let seconds = Math.floor(timeInMs / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // Calculate the total active time of each task by summing up the durations of all activity periods within the observation interval
  const calculateActiveTime = (task) => {
    // The function calculates the total active time of each task within a specified observation interval (from `start` to `end`).
    return task.startTime.reduce((total, startTime, i) => {
      // `startTime` and `i` are the elements and indices of the `task.startTime` array respectively, while `total` is the accumulator that collects the sum of all durations.
      if (
        (new Date(startTime) >= start && new Date(startTime) <= end) ||
        (new Date(task.stopTime[i]) >= start &&
          new Date(task.stopTime[i]) <= end)
      ) {
        // The `if` condition checks whether the start time or stop time of any activity period falls within the observation interval.
        let duration =
          task.isActive && i === task.startTime.length - 1
            ? // If the task is currently active (i.e., `task.isActive` is `true`) and the current start time is the last one in the `task.startTime` array (`i === task.startTime.length - 1`), the duration is calculated as the difference between the current time (`Date.now()`) and the largest of the start time and the start of the observation interval (`Math.max(startTime, start)`).
              Date.now() - Math.max(new Date(startTime), start)
            : // For all other activity periods, the duration is calculated as the difference between the smallest of the stop time and the end of the observation interval (`Math.min(task.stopTime[i], end)`) and the largest of the start time and the start of the observation interval (`Math.max(startTime, start)`).
              Math.min(new Date(task.stopTime[i]), end) -
              Math.max(new Date(startTime), start);
        return total + duration;
      }
      return total;
    }, 0);
  };

  // ================================= Calculate Tag Active Time ====================================================================
  // Calculate tags of interest directly in the component's body
  const allTags = tasksOfInterest.reduce((acc, task) => {
    // Spread both accumulator and task's tags into a new array
    return [...acc, ...task.tags];
  }, []);
  // Create a new Set from allTags to remove duplicates, then spread into an array
  const uniqueTags = [...new Set(allTags)];

  const tagsOfInterest = uniqueTags.map((tag) => {
    // Filter tasks that include the current tag
    const tasksWithThisTag = tasksOfInterest.filter((task) =>
      task.tags.includes(tag)
    );
    // Reduce tasksWithThisTag to a total active time for the current tag
    const activeTimeForTag = tasksWithThisTag.reduce((total, task) => {
      // Add the active time of the current task to the total
      return total + calculateActiveTime(task);
    }, 0);
    // Return an object with the tag and its total active time
    return { tag, activeTime: activeTimeForTag }; // Use formatTime here
  });

  // ================================= return ====================================================================
  return (
    <div className="summary">
      <ul>
        <li>
          This view allows you to monitor your tasks and their associated tags
          within a specified observation interval. By default, this interval
          covers the current day from its beginning to the current time. You can
          modify this interval to any duration of your choice, starting from any
          specific date and time, up to the minute precision.
        </li>
        <li>
          The view provides a summary of the total active times for each task
          and tag that were active during the observation interval, known as
          tasks and tags of interest. The total active time is the sum of the
          durations of individual activity periods of each task or tag within
          the observation interval. Please note that tasks or tags that were not
          active during the observation interval are not shown in the summary as
          their total active times are zero.
        </li>
      </ul>

      <hr />

      <h3>
        {/* Display the observation interval */}
        Observation interval: {new Date(start).toLocaleString()} to{" "}
        {new Date(end).toLocaleString()}
      </h3>
      <label>
        {/* Get the start time from the user */}
        Start Time:{" "}
        <input type="datetime-local" step="1" onChange={handleStartChange} />
      </label>
      <br />
      <br />
      <label>
        {/* Get the end time from the user */}
        End Time:{" "}
        <input type="datetime-local" step="1" onChange={handleEndChange} />
      </label>

      <hr />

      {/* Map through the tasks of interest and display their details */}
      <h2>Tasks of Interest</h2>
      {tasksOfInterest.map((task, index) => (
        <div key={task.id}>
          <h3> {`${index + 1}. ${task.name}`}</h3>
          <p>Tags: {task.tags.join(", ")}</p>
          {/* Calculate and display the total active time for each task */}
          <p>Total Active Time: {formatTime(calculateActiveTime(task))}</p>
        </div>
      ))}

      <hr />

      <h2>Tags of Interest</h2>
      {/* Map through the tags of interest and display their details */}
      {tagsOfInterest.map((tag, index) => (
        <div key={tag.tag}>
          <h3>{`${index + 1}. ${tag.tag}`}</h3>
          {/* Calculate and display the total active time for each tag */}
          <p>Total Active Time: {formatTime(tag.activeTime)}</p>
        </div>
      ))}
    </div>
  );
};

export default Summary;
