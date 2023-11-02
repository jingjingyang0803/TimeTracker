import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart } from "chart.js";
import { CategoryScale } from "chart.js/auto";
Chart.register(CategoryScale);

const Charts = () => {
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

  // This function takes a time duration in milliseconds as input and returns the time formatted as hours, minutes, and seconds.
  const formatTime = (timeInMs) => {
    let seconds = Math.floor(timeInMs / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const calculateDailyActiveTime = (task) => {
    // Mapping each startTime to a day and its duration
    const dailyDurations = task.startTime
      .map((startTime, i) => {
        // Defining the start and end of a day for each startTime
        let startOfDay = new Date(startTime).setHours(0, 0, 0, 0);
        let endOfDay = new Date(startTime).setHours(23, 59, 59, 999);
        // Defining the stopTime, if the task is currently active and is the last startTime, then it's now, else it's the corresponding stopTime
        let stopTime =
          task.isActive && i === task.startTime.length - 1
            ? Date.now()
            : task.stopTime[i];

        // Checking if the startTime or stopTime falls within the start and end of the day
        if (
          (startTime >= startOfDay && startTime <= endOfDay) ||
          (stopTime >= startOfDay && stopTime <= endOfDay)
        ) {
          // Calculating duration as the difference between the min of stopTime and endOfDay and the max of startTime and startOfDay
          let duration =
            Math.min(stopTime, endOfDay) - Math.max(startTime, startOfDay);
          // Returning an object containing the day and its duration
          return { day: new Date(startOfDay).toLocaleDateString(), duration };
        }
        // Returning null if startTime or stopTime does not fall within the start and end of the day
        return null;
      })
      // Filtering out null values
      .filter((day) => day !== null);

    // If task is active, increase the duration of the last interval by the difference between now and the start of the last interval day
    if (task.isActive) {
      let lastInterval = dailyDurations[dailyDurations.length - 1];
      lastInterval.duration +=
        Date.now() - new Date(lastInterval.day).getTime();
    }

    // Returning the daily durations
    return dailyDurations;
  };

  // Function to handle button click and set selected task and chart data
  const handleButtonClick = (task) => {
    setSelectedTask(task);
    const data = calculateDailyActiveTime(task).map(({ day, duration }) => ({
      x: day,
      y: duration / 60000, // Convert duration to minutes,
    }));
    setChartData({
      labels: data.map((item) => item.x),
      datasets: [
        {
          label: "Daily active time (minutes)",
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

  return (
    <div className="charts">
      <ul>
        <li>
          In this dynamic view, the user starts by specifying a time interval.
          After setting the desired interval, the tasks that have been active
          within this interval are displayed. For each task, the daily active
          time is computed and displayed in hours, minutes, and seconds.
        </li>
        <li>
          If the user wishes to see this information in a more visual format,
          they can click the "Show in Chart" button next to each task. This
          action generates a bar chart that visualizes the daily active time of
          the selected task. Each bar in the chart represents a single day. The
          lengths of the bars depict the daily sums of durations of time
          intervals when the task has been active. If the task is currently
          active, the duration of the ongoing interval is also included in the
          chart.
        </li>
        <li>
          The start and end of the interval can be adjusted using the provided
          date input fields. By default, the start date is set to the beginning
          of the current month and the end date is set to the end of the current
          day.
        </li>
      </ul>
      <hr />
      <h2>Daily Active Time</h2>
      {tasksOfInterest.map((task, index) => (
        <div key={task.id}>
          <h3>{`${index + 1}. ${task.name}`}</h3>
          {/* For each task in tasksOfInterest, display its name and daily active time */}
          {calculateDailyActiveTime(task).map(({ day, duration }, index) => (
            <p key={index}>
              <i>{day}:</i> {formatTime(duration)}
            </p>
          ))}
          <button onClick={() => handleButtonClick(task)}>
            Show in Bar Chart
          </button>
          {selectedTask && selectedTask.id === task.id && (
            <div>
              {/* Render the chart of the selected task below the task */}
              <h4>Chart for "{selectedTask.name}"</h4>
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

export default Charts;
