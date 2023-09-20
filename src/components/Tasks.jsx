import React, { useEffect, useState } from "react";

const TaskViewIntructions = () => {
  return (
    <div>
      <ul>
        <li>
          <b>Creating Tasks: </b>Click on the "Add Task" button to create a new
          task. Enter the task name and assign tags as needed.
        </li>
        <li>
          <b>Editing Tasks: </b>Select a task from the task list and click on
          the "Edit" button. Modify the task name and tags as desired.
        </li>
        <li>
          <b>Deleting Tasks: </b>In the task list, click on the "Delete" button
          next to the task you want to remove.
        </li>
        <li>
          <b>Tracking Time: </b>To start tracking time for a task, click on the
          "Activate" button. To stop tracking, click on the "Deactivate" button.
        </li>
        <li>
          <b>Filtering Tasks: </b>Use the tag filter menu to show only tasks
          with specific tags. Select multiple tags to narrow down the task list.
        </li>
      </ul>
    </div>
  );
};

const TaskElement = ({ name, tags }) => {
  return (
    <li>
      Task Name: {name} {/* Display the name of the task */}
      <br />
      Tags: {tags.join(", ")} {/* Display the tags of the task */}
    </li>
  );
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3010/tasks") // Make a GET request to fetch the task data from the backend server
      .then((response) => {
        console.log(response);
        return response.json(); // Parse the response JSON
      })
      .then((data) => {
        console.log(data); // Log the fetched data to the console
        setTasks(data); // Update the state variable with the fetched task data
      })
      .catch((error) => console.log(error)); // Handle any errors during the fetch request
  }, []);

  return (
    <div>
      <TaskViewIntructions />
      <hr />
      <ol>
        {/* Map through the tasks and render a TaskElement component for each task */}
        {tasks.map((task) => (
          <TaskElement key={task.id} name={task.name} tags={task.tags} />
        ))}
      </ol>
    </div>
  );
};

export default Tasks;
