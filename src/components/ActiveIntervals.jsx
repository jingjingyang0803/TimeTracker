import React, { useEffect, useState } from "react";

const ActiveIntervals = () => {
  // ================================= useState and useEffect ====================================================
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState();

  // Initialize `start` state
  const [start, setStart] = useState("");
  // Initialize `end` state
  const [end, setEnd] = useState("");

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
    fetch("http://localhost:3010/tasks")
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
      })
      .catch((error) => console.log(error));
  }, [tasks]);

  // ================================= Select a Task =============================================================
  // Function to handle task selection
  const handleTaskSelect = (event) => {
    const selectedTaskId = event.target.value;

    // Retrieve the selected task's data
    const newSelectedTask = tasks.find((task) => task.id == selectedTaskId);
    setSelectedTask(newSelectedTask);

    if (newSelectedTask) {
      // Set the start and end times based on the selected task's data
      setStart(new Date(newSelectedTask.startInterval).getTime());
      setEnd(new Date(newSelectedTask.endInterval).getTime());
    }
  };

  // ================================= Save Changes To Server ====================================================
  // Send changes made to a task to the server
  const sendChangesToServer = (taskId, updatedTask) => {
    fetch(`http://localhost:3010/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Changes saved successfully:", data);
      })
      .catch((error) => {
        console.error("Failed to save changes:", error);
      });
  };

  // ================================= Set Task details interval ==================================================
  // Handle the change in the start time of the observation interval
  const handleStartChange = (event) => {
    // Convert the date from the input field to a timestamp and update the start state
    const newStart = new Date(event.target.value).getTime();
    setStart(newStart);

    // Update the selected task's startInterval in the tasks data
    if (selectedTask) {
      const updatedTasks = tasks.map((task) => {
        if (task.id === selectedTask.id) {
          task.startInterval = new Date(event.target.value).toISOString();
        }
        return task;
      });

      setTasks(updatedTasks);
    }

    sendChangesToServer(selectedTask.id, {
      ...tasks.find((task) => task.id === selectedTask.id),
      startInterval: new Date(newStart).toISOString(),
    });
  };

  // Handle the change in the end time of the observation interval
  const handleEndChange = (event) => {
    // Convert the date from the input field to a timestamp and update the end state
    const newEnd = new Date(event.target.value).getTime();
    setEnd(newEnd);

    // Update the selected task's endInterval in the tasks data
    if (selectedTask) {
      const updatedTasks = tasks.map((task) => {
        if (task.id === selectedTask.id) {
          task.endInterval = new Date(event.target.value).toISOString();
        }
        return task;
      });

      setTasks(updatedTasks);
    }

    sendChangesToServer(selectedTask.id, {
      ...tasks.find((task) => task.id === selectedTask.id),
      stopInterval: new Date(newEnd).toISOString(),
    });
  };

  // ================================= calculate Active Intervals ================================================
  // Calculate the active intervals of a task within the observation interval
  const calculateActiveIntervals = (task) => {
    // Map over each start time of the task
    return (
      task.startTime
        .map((startTime, i) => {
          // Check if the start time or the corresponding stop time is within the observation interval
          if (
            (new Date(startTime).getTime() >= start &&
              new Date(startTime).getTime() <= end) ||
            (new Date(task.stopTime[i]).getTime() >= start &&
              new Date(task.stopTime[i]).getTime() <= end)
          ) {
            // If so, calculate the start and end of the active interval within the observation interval
            let intervalStart = Math.max(start, new Date(startTime).getTime());
            let intervalEnd =
              task.isActive && i === task.startTime.length - 1
                ? // If the task is currently active and this is the last start time, the end of the interval is either the current time or the end of the observation interval, whichever is smaller
                  Math.min(end, Date.now())
                : // Otherwise, the end of the interval is either the corresponding stop time or the end of the observation interval, whichever is smaller
                  Math.min(end, new Date(task.stopTime[i]).getTime());
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
    <div className="interval">
      <ul>
        <li>
          <u>Select a task</u>: The dropdown menu presents a list of tasks
          fetched from the server. Select one to view its details.
        </li>{" "}
        <li>
          <u>View task details</u>: Once a task is selected, its task details
          interval is displayed.The view also automatically displays the active
          intervals of a task within the task details interval. If a task is
          currently active, the end of the interval is either the current time
          or the end of the observation interval, whichever is smaller.
        </li>
        <li>
          <u>Reset task details interval</u>: Use the provided input fields to
          reset the task details interval as desired.These changes are updated
          in the system and sent back to the server for synchronization.
        </li>
      </ul>

      <hr />

      <label>
        <select defaultValue="" onChange={handleTaskSelect}>
          <option value="" disabled>
            Select a Task
          </option>
          {tasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.name}
            </option>
          ))}
        </select>
      </label>

      {selectedTask && (
        <div key={selectedTask.id}>
          <h3>
            {/* Displaying the task details interval with start and end dates */}
            Task details interval:{" "}
            {selectedTask.startInterval &&
              selectedTask.endInterval &&
              `${new Date(start).toLocaleString()} - ${new Date(
                end
              ).toLocaleString()}`}
          </h3>
          <label>
            {/* Input field for setting the Start Time */}
            Reset Start Time:{" "}
            <input
              type="datetime-local"
              step="1"
              onChange={handleStartChange}
            />
          </label>
          <br />
          <br />
          <label>
            {/* Input field for setting the End Time */}
            Reset End Time:{" "}
            <input type="datetime-local" step="1" onChange={handleEndChange} />
          </label>
          {/* Calculate and display active intervals for the selected task */}
          <h2>{selectedTask.name}</h2>
          {calculateActiveIntervals(selectedTask).map((interval, i) => (
            <p key={i}>
              {i + 1}.{" "}
              {interval.start &&
                interval.end &&
                `${new Date(interval.start).toLocaleString()} - ${new Date(
                  interval.end
                ).toLocaleString()}`}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveIntervals;
