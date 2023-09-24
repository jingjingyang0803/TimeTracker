import React, { useEffect, useState } from "react";
import Filter from "./Filter";
import TaskElement from "./TaskElement";
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
          <b>Adding a Tag to a Task:</b> Click on the select element to open the
          dropdown list. Choose an existing tag from the list or select "Custom"
          to create a new tag. If you select "Custom", a prompt will appear
          where you can enter the new tag. Enter the new tag and click "OK" to
          add it to the task.
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

const Tasks = () => {
  const [tasks, setTasks] = useState([]); // State for storing tasks
  const [newName, setNewName] = useState(""); // State for new task name
  const [newTags, setNewTags] = useState([]); // State for new task tags
  const [filteredTasks, setFilteredTasks] = useState([]); // State for filtered tasks

  // Fetch tasks from the server on component mount
  useEffect(() => {
    fetch("http://localhost:3010/tasks")
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
        setFilteredTasks(data);
      })
      .catch((error) => console.log(error));
  }, []);

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

  // Update task tags and send changes to the server
  const updateTaskTags = (taskId, updatedTags) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, tags: updatedTags } : task
    );
    setTasks(updatedTasks);
    setFilteredTasks(updatedTasks);
    sendChangesToServer(taskId, {
      ...tasks.find((task) => task.id === taskId),
      tags: updatedTags,
    });
  };

  // Handle removal of a tag from a task
  const handleRemoveTag = (taskId, index) => {
    const task = tasks.find((task) => task.id === taskId);
    const updatedTags = [...task.tags];

    if (updatedTags.length > 1) {
      updatedTags.splice(index, 1);
      updateTaskTags(taskId, updatedTags);
    } else {
      alert("Cannot remove tag. Task must have at least one tag.");
    }

    sendChangesToServer(taskId, { ...task, tags: updatedTags });
  };

  // Handle addition of a tag to a task
  const handleAddTag = (taskId, newTag) => {
    const task = tasks.find((task) => task.id === taskId);
    const updatedTags = [...task.tags, newTag];

    updateTaskTags(taskId, updatedTags);
    sendChangesToServer(taskId, { ...task, tags: updatedTags });
  };

  // Remove a task from the server
  const removeTaskFromServer = (taskId) => {
    fetch(`http://localhost:3010/tasks/${taskId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Task removed successfully:", data);
      })
      .catch((error) => {
        console.error("Failed to remove task:", error);
      });
  };

  // Handle removal of a task
  const handleRemoveTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    setFilteredTasks(updatedTasks);

    removeTaskFromServer(taskId);
  };

  // Add a new task to the server
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
      })
      .catch((error) => {
        console.error("Failed to add new task:", error);
      });
  };

  // Handle addition of a task
  const handleAddTask = () => {
    if (newName.trim() !== "" && newTags.length > 0) {
      const lastTask = tasks[tasks.length - 1];
      const newTaskId = lastTask ? lastTask.id + 1 : 1;

      const newTask = {
        id: newTaskId,
        name: newName,
        tags: newTags,
      };

      setTasks([...tasks, newTask]);
      setFilteredTasks([...tasks, newTask]);
      setNewName("");
      setNewTags([]);
      alert("Task added successfully!");

      addTaskToServer(newTask);
    } else {
      // Alert to notify the user if the task addition fails
      alert(
        "Failed to add task. Please enter a task name and at least one tag."
      );
    }
  };

  // Handle editing of a task name
  const handleEditTaskName = (taskId, newTaskName) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, name: newTaskName } : task
    );
    setTasks(updatedTasks);
    setFilteredTasks(updatedTasks);
    sendChangesToServer(taskId, {
      ...tasks.find((task) => task.id === taskId),
      name: newTaskName,
    });
  };

  return (
    <div>
      <TaskViewInstructions />
      <hr />
      <Filter tasks={tasks} setFilteredTasks={setFilteredTasks} />
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
            value={newTags.join(",")}
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
        {filteredTasks.map((task) => (
          <TaskElement
            key={task.id}
            taskId={task.id}
            name={task.name}
            tags={task.tags}
            handleRemoveTag={handleRemoveTag}
            handleAddTag={handleAddTag}
            handleRemoveTask={handleRemoveTask}
            handleEditTaskName={handleEditTaskName}
            tasks={tasks}
          />
        ))}
      </ol>
    </div>
  );
};

export default Tasks;
