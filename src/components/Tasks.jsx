import React, { useEffect, useState } from "react";
import "../styles/Tasks.css";

const TaskViewInstructions = () => {
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

const TaskElement = ({ taskId, name, tags, handleRemoveTag }) => {
  const removeTag = (index) => {
    console.log("Remove tag function called");
    console.log("Clicked Tag:", tags[index]);
    handleRemoveTag(taskId, index);
  };

  return (
    <div className="task">
      <div className="task-name">Task Name: {name}</div>
      <div className="task-tags">
        Tags:{" "}
        {tags.map((tag, index) => (
          <span key={index}>
            {tag}{" "}
            <button onClick={() => removeTag(index)} className="tag-remove">
              x
            </button>
          </span>
        ))}
      </div>
    </div>
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

  // Function to handle removing a tag from a task
  const handleRemoveTag = (taskId, index) => {
    const taskIndex = tasks.findIndex((task) => task.id === taskId); // Find the index of the task
    const task = tasks[taskIndex]; // Get the task object
    const updatedTags = [...task.tags]; // Create a copy of the tags array

    if (updatedTags.length > 1) {
      // Check if there is more than one tag
      updatedTags.splice(index, 1); // Remove the tag at the specified index
      console.log("Updated Tags:", updatedTags); // Log the updated tags to the console
      const updatedTask = { ...task, tags: updatedTags }; // Create an updated task object with the modified tags
      const updatedTasks = [...tasks]; // Create a copy of the tasks array
      updatedTasks[taskIndex] = updatedTask; // Replace the task at the specified index with the updated task
      setTasks(updatedTasks); // Update the tasks state variable with the updated array
    } else {
      alert("Cannot remove tag. Task must have at least one tag."); // Alert the user if the task only has one tag
    }
  };

  return (
    <div>
      <TaskViewInstructions />
      <hr />
      <ol>
        {/* Map through the tasks and render a TaskElement component for each task */}
        {tasks.map((task) => (
          <TaskElement
            key={task.id}
            taskId={task.id}
            name={task.name}
            tags={task.tags}
            handleRemoveTag={handleRemoveTag}
          />
        ))}
      </ol>
    </div>
  );
};
export default Tasks;
