import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart } from "chart.js";
import { CategoryScale } from "chart.js/auto";
Chart.register(CategoryScale);

const DailyActiveChart = () => {
  // ================================= useState and useEffect ======================================================
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [chartData, setChartData] = useState({});

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

  // ================================= Set daily activity chart interval =========================================

  // Handle change of start date
  const handleStartChange = (event) => {
    setStart(new Date(event.target.value).getTime());
  };

  // Handle change of end date
  const handleEndChange = (event) => {
    setEnd(new Date(event.target.value).getTime());
  };

  // ================================= Calculate Daily Active Time ===============================================
  // This function takes a time duration in milliseconds as input and returns the time formatted as hours, minutes, and seconds.
  // Filter tasks that are active within the set interval
  const tasksOfInterest = tasks.filter((task) =>
    task.startTime.some(
      (time) =>
        new Date(time).getTime() >= start && new Date(time).getTime() <= end
    )
  );

  const formatTime = (timeInMs) => {
    let seconds = Math.floor(timeInMs / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const calculateDailyActiveTime = (task, startDate, endDate) => {
    const dailyDurations = {};

    for (let i = 0; i < task.startTime.length; i++) {
      const startTime = new Date(task.startTime[i]).getTime();
      let stopTime = new Date(task.stopTime[i]).getTime();

      // If the task is currently active and it's the last activation, set stopTime to now
      if (task.isActive && i === task.startTime.length - 1) {
        stopTime = new Date();
      }

      // Create start and end of the day for the startTime
      const startOfDay = new Date(startTime);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(startTime);
      endOfDay.setHours(23, 59, 59, 999);

      // Check if the startTime falls within the specified date range
      if (startTime >= startDate && startTime <= endDate) {
        const dayKey = startOfDay.toDateString();
        const duration = stopTime - startTime;

        if (!dailyDurations[dayKey]) {
          dailyDurations[dayKey] = {
            day: startOfDay.toLocaleDateString(),
            duration: 0,
          };
        }

        if (stopTime >= endOfDay) {
          dailyDurations[dayKey].duration += endOfDay - startTime;
        } else {
          dailyDurations[dayKey].duration += duration;
        }
      }
    }

    const today = new Date();
    const todayKey = today.toDateString();

    // Check if today is within the specified date range and if the task is currently active
    if (task.isActive && today >= startDate && today <= endDate) {
      if (!dailyDurations[todayKey]) {
        // Create a new entry for today if it doesn't exist
        dailyDurations[todayKey] = {
          day: today.toLocaleDateString(),
          duration: 0,
        };
      }

      // Add the duration from the start of the day until now
      dailyDurations[todayKey].duration +=
        today - new Date(today.toDateString());
    }

    // Log the daily durations within the specified date range
    for (const dayKey in dailyDurations) {
      if (dailyDurations.hasOwnProperty(dayKey)) {
        const day = dailyDurations[dayKey];
        console.log(`Day: ${day.day}, Duration: ${day.duration} ms`);
      }
    }

    return dailyDurations;
  };

  // ================================= Render Bar Chart ==========================================================

  // Function to handle button click and set selected task and chart data
  const handleButtonClick = (task) => {
    setSelectedTask(task);
    const data = Object.values(calculateDailyActiveTime(task, start, end)).map(
      ({ day, duration }) => ({
        x: day,
        y: duration / 60000, // Convert duration to minutes,
      })
    );
    setChartData({
      labels: data.map((item) => item.x),
      datasets: [
        {
          label: "Daily active time (in minutes)",
          data: data.map((item) => item.y),
          backgroundColor: "rgba(75,192,192,0.6)",
          borderColor: "rgba(75,192,192,1)",
          borderWidth: 1,
        },
      ],
    });
  };

  // Render Bar Chart if a task has been selected
  let renderChart;
  if (selectedTask) {
    renderChart = (
      <div>
        <h2>Daily Active Time for "{selectedTask.name}"</h2>
        <Bar data={chartData} />
      </div>
    );
  }

  // ================================= Return ====================================================================
  return (
    <div className="charts">
      <ul>
        <li>
          In this dynamic view, the user starts by specifying a time interval.
          After setting the desired interval, the tasks that have been active
          within this interval are displayed. For each task, the{" "}
          <u>daily active time</u> is computed and displayed in hours, minutes,
          and seconds.
        </li>
        <li>
          If the user wishes to see this information in a more visual format,
          they can click the "Show in Chart" button next to each task. This
          action generates <u>a bar chart</u> that visualizes the daily active
          time of the selected task. Each bar in the chart represents a single
          day. The lengths of the bars depict the daily sums of durations of
          time intervals when the task has been active. If the task is currently
          active, the duration of the <u>ongoing interval</u> is also included
          in the chart.
        </li>
        <li>
          The start and end of the interval can be adjusted using the provided
          date input fields. By default, the start date is set to{" "}
          <u>the beginning of the current month</u> and the end date is set to
          <u>the end of the current day</u>.
        </li>
      </ul>

      <hr />

      <h2>Daily activity chart interval</h2>
      <h3>
        {/* Display the Daily activity chart interval */}
        {new Date(start).toLocaleString()} - {new Date(end).toLocaleString()}
      </h3>
      <label>
        Start Date: {/* Input field for the start date of the interval */}
        <input
          type="datetime-local"
          onChange={handleStartChange} // When the date is changed, handleStartChange function is called
        />
      </label>
      <br />
      <br />
      <label>
        End Date: {/* Input field for the end date of the interval */}
        <input
          type="date"
          onChange={handleEndChange} // When the date is changed, handleEndChange function is called
          value={new Date(end).toISOString().substring(0, 10)} // The value is the end date in ISO format
        />
      </label>

      <hr />

      <h2>Daily Active Time</h2>
      {tasksOfInterest.map((task, index) => (
        <div key={task.id}>
          <h3>{`${index + 1}. ${task.name}`}</h3>
          {/* For each task in tasksOfInterest, display its name and daily active time */}
          {Object.values(calculateDailyActiveTime(task, start, end)).map(
            ({ day, duration }, index) => (
              <p key={index}>
                <i>{day}:</i> {formatTime(duration)}
              </p>
            )
          )}

          <button onClick={() => handleButtonClick(task)}>
            Show in Bar Chart
          </button>
          {selectedTask && selectedTask.id === task.id && (
            <div>
              {/* Render the chart of the selected task below the task */}
              {selectedTask && selectedTask.id === task.id && (
                <div>
                  <h2>Daily Active Time for "{selectedTask.name}"</h2>
                  <Bar data={chartData} />
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DailyActiveChart;
