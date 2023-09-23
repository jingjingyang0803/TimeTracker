import React, { useEffect, useState } from "react";
import "../styles/Tasks.css";

const TaskViewInstructions = () => {
  return (
    <div>
      <ul>
        <li>
          <b>Adding a Task:</b> Enter the task details in the "Enter task
          details to create a new task" section. Provide a task name in the
          "task name" input field and add one or more tags in the "tags" input
          field separated by commas. Then, click the "Add Task" button.
        </li>
        <li>
          <b>Removing a Task:</b> Click the "Remove" button next to the task you
          want to remove.
        </li>
        <li>
          <b>Editing a Task Name:</b> Click the "Edit" button next to the task
          you want to edit. In the prompt that appears, enter the new task name
          and click "OK". The task name will be updated.
        </li>
        <li>
          <b>Adding a Tag to a Task:</b> Click the "+" button next to the task's
          tags. In the prompt that appears, enter the new tag and click "OK".
          The tag will be added to the task.
        </li>
        <li>
          <b>Removing a Tag from a Task:</b> Click the "x" button next to the
          tag you want to remove.
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

const TaskElement = ({
  taskId,
  name,
  tags,
  handleRemoveTag,
  handleAddTag,
  handleRemoveTask,
  handleEditTaskName,
}) => {
  const removeTag = (index) => {
    console.log("Remove tag function called");
    console.log("Clicked Tag:", tags[index]);
    handleRemoveTag(taskId, index);
  };

  const addTag = () => {
    const newTag = prompt("Enter a new tag:"); // Prompt the user to enter a new tag

    if (newTag !== null) {
      const trimmedTag = newTag.trim();
      if (trimmedTag !== "") {
        console.log("New Tag:", trimmedTag);
        handleAddTag(taskId, trimmedTag); // Pass the trimmedTag value to the handleAddTag function
      } else {
        alert("Tag cannot be empty. Please enter a valid tag.");
      }
    } else {
      console.log("User clicked Cancel");
    }
  };

  const removeTask = () => {
    handleRemoveTask(taskId);
  };

  const editTaskName = () => {
    const newTaskName = prompt("Enter a new task name:"); // Prompt the user to enter a new task name

    if (newTaskName !== null) {
      const trimmedTaskName = newTaskName.trim();
      if (trimmedTaskName !== "") {
        console.log("New Task Name:", trimmedTaskName);
        handleEditTaskName(taskId, trimmedTaskName); // Pass the trimmedTaskName value to the handleEditTaskName function
      } else {
        alert("Task name cannot be empty. Please enter a valid task name.");
      }
    } else {
      console.log("User clicked Cancel");
    }
  };
  return (
    <div className="task">
      <button onClick={editTaskName} className="task-edit">
        Edit
      </button>
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
        <button onClick={addTag} className="tag-add">
          +
        </button>
      </div>

      <button onClick={removeTask} className="task-remove">
        Remove
      </button>
    </div>
  );
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newName, setNewName] = useState("");
  const [newTags, setNewTags] = useState([]);

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

  // Function to send the changes made by the user to the server
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

  const updateTaskTags = (taskId, updatedTags) => {
    const taskIndex = tasks.findIndex((task) => task.id === taskId); // Find the index of the task
    const task = tasks[taskIndex]; // Get the task object
    const updatedTask = { ...task, tags: updatedTags }; // Create an updated task object with the modified tags
    const updatedTasks = [...tasks]; // Create a copy of the tasks array
    updatedTasks[taskIndex] = updatedTask; // Replace the task at the specified index with the updated task
    setTasks(updatedTasks); // Update the tasks state variable with the updated array

    // Send the updated task to the server
    sendChangesToServer(taskId, updatedTask);
  };

  const handleRemoveTag = (taskId, index) => {
    const taskIndex = tasks.findIndex((task) => task.id === taskId); // Find the index of the task
    const task = tasks[taskIndex]; // Get the task object
    const updatedTags = [...task.tags]; // Create a copy of the tags array

    if (updatedTags.length > 1) {
      updatedTags.splice(index, 1); // Remove the tag at the specified index
      console.log("Updated Tags:", updatedTags); // Log the updated tags to the console
      updateTaskTags(taskId, updatedTags); // Call the updateTaskTags function to update the task with the modified tags
    } else {
      alert("Cannot remove tag. Task must have at least one tag."); // Alert the user if the task only has one tag
    }

    // Prepare the updated task object
    const updatedTask = {
      id: taskId,
      name: task.name,
      tags: updatedTags,
    };

    // Send the updated task to the server
    sendChangesToServer(taskId, updatedTask);
  };

  const handleAddTag = (taskId, newTag) => {
    const taskIndex = tasks.findIndex((task) => task.id === taskId); // Find the index of the task
    const task = tasks[taskIndex]; // Get the task object
    const updatedTags = [...task.tags, newTag]; // Create a new array with the existing tags and the new tag

    console.log("Updated Tags:", updatedTags); // Log the updated tags to the console
    updateTaskTags(taskId, updatedTags); // Call the updateTaskTags function to update the task with the new tag

    // Prepare the updated task object
    const updatedTask = {
      id: taskId,
      name: task.name,
      tags: updatedTags,
    };

    // Send the updated task to the server
    sendChangesToServer(taskId, updatedTask);
  };

  // Function to remove a task from the server
  const removeTaskFromServer = (taskId) => {
    fetch(`http://localhost:3010/tasks/${taskId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Task removed successfully:", data);
        // Update the UI or perform any necessary actions after removing the task
      })
      .catch((error) => {
        console.error("Failed to remove task:", error);
      });
  };

  const handleRemoveTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId); // Filter out the task with the specified taskId
    setTasks(updatedTasks); // Update the tasks state variable with the filtered array

    removeTaskFromServer(taskId);
  };

  // Function to add a new task to server
  const addTaskToServer = (newTask) => {
    fetch("http://localhost:3010/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("New task added successfully:", data);
        // Update the UI or perform any necessary actions after adding the task
      })
      .catch((error) => {
        console.error("Failed to add new task:", error);
      });
  };

  const handleAddTask = () => {
    if (newName.trim() !== "" && newTags.length > 0) {
      const lastTask = tasks[tasks.length - 1]; // Get the last task in the tasks array
      const newTaskId = lastTask ? lastTask.id + 1 : 1; // Generate a unique key for the new task

      const newTask = {
        id: newTaskId,
        name: newName,
        tags: newTags,
      };

      setTasks([...tasks, newTask]);
      setNewName("");
      setNewTags([]);
      alert("Task added successfully!");

      addTaskToServer(newTask);
    } else {
      alert(
        "Failed to add task. Please enter a task name and at least one tag."
      );
    }
  };

  const handleEditTaskName = (taskId, newTaskName) => {
    const taskIndex = tasks.findIndex((task) => task.id === taskId); // Find the index of the task
    const task = tasks[taskIndex]; // Get the task object
    const updatedTask = { ...task, name: newTaskName }; // Create an updated task object with the modified task name
    const updatedTasks = [...tasks]; // Create a copy of the tasks array
    updatedTasks[taskIndex] = updatedTask; // Replace the task at the specified index with the updated task
    setTasks(updatedTasks); // Update the tasks state variable with the updated array

    // Send the updated task to the server
    sendChangesToServer(taskId, updatedTask);
  };

  return (
    <div>
      <TaskViewInstructions />
      <hr />
      <div className="add-task-container">
        <p>Enter task details to create a new task:</p>
        <div>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="task name"
            className="task-input"
          />
          <input
            type="text"
            value={newTags}
            onChange={(e) => setNewTags(e.target.value.split(","))}
            placeholder="tags(separated by commas)"
            className="task-input"
          />
          <button onClick={handleAddTask} className="add-task-button">
            Add Task
          </button>
        </div>
      </div>
      <ol>
        {/* Map through the tasks and render a TaskElement component for each task */}
        {tasks.map((task) => (
          <TaskElement
            key={task.id}
            taskId={task.id}
            name={task.name}
            tags={task.tags}
            handleRemoveTag={handleRemoveTag}
            handleAddTag={handleAddTag}
            handleRemoveTask={handleRemoveTask}
            handleEditTaskName={handleEditTaskName}
          />
        ))}
      </ol>
    </div>
  );
};
export default Tasks;
