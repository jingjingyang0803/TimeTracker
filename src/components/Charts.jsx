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

  // Function to handle button click and set selected task and chart data
  const handleButtonClick = (task) => {
    setSelectedTask(task);
    const data = calculateDailyActiveTime(task).map(({ day, duration }) => ({
      x: day,
      y: duration,
    }));
    setChartData({
      labels: data.map((item) => item.x),
      datasets: [
        {
          label: "Daily active time",
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
        <h2>Daily Active Time for {selectedTask.name}</h2>
        <Bar data={chartData} />
      </div>
    );
  }

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
          <button onClick={() => handleButtonClick(task)}>Show in Chart</button>
        </div>
      ))}
      {renderChart}
    </div>
  );
};

export default Charts;
