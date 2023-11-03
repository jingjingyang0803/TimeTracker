import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import Filter from "./Filter";
import TaskElement from "./TaskElement";
import "../styles/Tasks.css";
const TaskViewInstructions = () => {
  return (
    <div>
      <ul>
        <li>
          <u>Filtering Tasks: </u>Use the tag filter menu to show only tasks
          with specific tags. Select multiple tags to narrow down the task list.
        </li>
        <hr className="dashed-line" />
        <li>
          <u>Adding a Task:</u> Enter the task details in the "Enter task
          details to create a new task" section. Provide a task name in the
          "task name" input field and add one or more tags in the "tags" input
          field separated by commas. Then, click the "Add Task" button.
        </li>
        <li>
          <u>Removing a Task:</u> Click the "Remove task" button next to the
          task you want to remove.
        </li>
        <li>
          <u>Editing a Task Name:</u> Click the "Edit task name" button next to
          the task you want to edit. In the prompt that appears, enter the new
          task name and click "OK". The task name will be updated.
        </li>
        <hr className="dashed-line" />
        <li>
          <u>Adding a Tag to a Task:</u> Click on the select element to open the
          dropdown list. Choose an existing tag from the list or select "Custom"
          to create a new tag. If you select "Custom", a prompt will appear
          where you can enter the new tag. Enter the new tag and click "OK" to
          add it to the task.
        </li>
        <li>
          <u>Removing a Tag from a Task:</u> Click the "x" button next to the
          tag you want to remove.
        </li>
        <hr className="dashed-line" />
        <li>
          <u>Tracking Time: </u>To start tracking time for a task, click on the
          "Activate" button. To stop tracking, click on the "Deactivate" button.
        </li>
        <hr className="dashed-line" />
        <li>
          <u>Drag and drop: </u>
          To move a task, click and hold on it, drag it to a new location, then
          release the mouse button. Changes will be automatically saved and
          updated in the task list.
        </li>
      </ul>
    </div>
  );
};

const Tasks = ({ singleTaskMode }) => {
  // ================================= useState and useEffect======================================================
  const [tasks, setTasks] = useState([]); // State for storing tasks
  const [newName, setNewName] = useState(""); // State for new task name
  const [newTags, setNewTags] = useState([]); // State for new task tags
  const [filteredTasks, setFilteredTasks] = useState([]); // State for filtered tasks
  const [message, setMessage] = useState("");

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

  // Use the useEffect hook to trigger a re-render whenever tasks change
  useEffect(() => {
    fetch("http://localhost:3010/tasks")
      .then((response) => response.json())
      .then((data) => {
        setTasks(data); // Update tasks state
        setFilteredTasks(data);
      })
      .catch((error) => console.log(error));
  }, [tasks, filteredTasks]); // Only trigger this effect when tasks change

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

  // ================================= Filter Tasks ==============================================================
  const handleFilter = () => {
    // Filter tasks to only include those that have every selected tag
    const filteredTasks = tasks.filter((task) => {
      return selectedTags.every((tag) => task.tags.includes(tag));
    });

    // Update the state to display the filtered tasks
    setFilteredTasks(filteredTasks);
  };

  // =================================  Add/Remove tag ===========================================================
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

  // Handle addition of a tag to a task
  const handleAddTag = (taskId, newTag) => {
    const task = tasks.find((task) => task.id === taskId); // Find the task with the given taskId
    const updatedTags = [...task.tags, newTag]; // Add the new tag to the tags of the task

    updateTaskTags(taskId, updatedTags); // Update the tags of the task
    sendChangesToServer(taskId, { ...task, tags: updatedTags }); // Send the changes to the server
  };

  // Handle removal of a tag from a task
  const handleRemoveTag = (taskId, index) => {
    const task = tasks.find((task) => task.id === taskId); // Find the task with the given taskId
    const updatedTags = [...task.tags]; // Copy the tags of the task

    if (updatedTags.length > 1) {
      // Check if the task has more than one tag
      updatedTags.splice(index, 1); // Remove the tag at the given index
      updateTaskTags(taskId, updatedTags); // Update the tags of the task
    } else {
      setMessage("Cannot remove tag. Task must have at least one tag."); // Set an error message
    }

    sendChangesToServer(taskId, { ...task, tags: updatedTags }); // Send the changes to the server
  };

  // ================================= Edit Task Name ==============================================================
  // Function to handle the editing of a task name
  const handleEditTaskName = (taskId, newTaskName) => {
    // Map through the tasks and update the name of the task with the provided taskId
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, name: newTaskName } : task
    );
    // Update the tasks state
    setTasks(updatedTasks);
    setFilteredTasks(updatedTasks);
    // Send the changes to the server
    sendChangesToServer(taskId, {
      ...tasks.find((task) => task.id === taskId),
      name: newTaskName,
    });
  };

  // =================================  Add Task ===================================================================
  // Function to add a new task to the server
  const addTaskToServer = (newTask) => {
    // Use fetch to make a POST request to the server
    fetch("http://localhost:3010/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask), // Convert the newTask object to a JSON string
    })
      .then((response) => response.json()) // Parse the response data as JSON
      .then((data) => {
        console.log("New task added successfully:", data); // Log the data received from the server
      })
      .catch((error) => {
        console.error("Failed to add new task:", error); // Log any errors
      });
  };

  // Function to handle the addition of a task
  const handleAddTask = () => {
    // Checks if the new task name is not empty and there is at least one tag
    if (newName.trim() !== "" && newTags.length > 0) {
      // Get the last task in the list
      const lastTask = tasks[tasks.length - 1];
      // If there is a last task, the new task ID will be the last task's ID + 1, otherwise it will be 1
      const newTaskId = lastTask ? lastTask.id + 1 : 1;

      // Create a new task object
      const newTask = {
        id: newTaskId,
        name: newName,
        tags: newTags,
        startTime: [],
        stopTime: [],
        isActive: false,
      };

      // Add the new task to the task list
      setTasks([...tasks, newTask]);
      setFilteredTasks([...tasks, newTask]);
      // Clear the input fields
      setNewName("");
      setNewTags([]);
      // alert("Task added successfully!");

      // Add the new task to the server
      addTaskToServer(newTask);
    } else {
      // Alert to notify the user if the task addition fails
      setMessage(
        "Failed to add task. Please enter a task name and at least one tag."
      );
    }
  };

  // =================================  Remove Task ==============================================================
  // Remove a task from the server
  const removeTaskFromServer = (taskId) => {
    fetch(`http://localhost:3010/tasks/${taskId}`, {
      // Send a DELETE request to the server with the taskId
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Task removed successfully:", data); // Log the response from the server
      })
      .catch((error) => {
        console.error("Failed to remove task:", error); // Log any error that occurs
      });
  };

  // Handle removal of a task
  const handleRemoveTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId); // Remove the task with the given taskId from the tasks
    setTasks(updatedTasks); // Update the tasks
    setFilteredTasks(updatedTasks); // Update the filtered tasks

    removeTaskFromServer(taskId); // Remove the task from the server
  };

  // ================================= Activate/Deactive Task ====================================================
  const handleStartTime = (id, newStartTime) => {
    // If only one task can be active at a time
    if (singleTaskMode) {
      // Deactivate all other tasks
      const updatedTasks = tasks.map((task) => {
        if (task.id != id && task.isActive == true) {
          const currentTime = new Date().toISOString();
          // Stop the current active task
          handleStopTime(task.id, currentTime);
          return { ...task, isActive: false }; // Update the task's isActive state to false
        }
        return task; // If the task is not active or is the current task, return it as is
      });

      // Update the tasks state with the new array, which will trigger a re-render
      setTasks(updatedTasks);
      // setFilteredTasks(updatedTasks);
    }

    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            // Add the new start time to the existing start times
            startTime: [...task.startTime, newStartTime],
            // Set the task to active
            isActive: true,
          }
        : task
    );
    // Update the tasks state
    setTasks(updatedTasks);

    // Send the updated task to the server
    sendChangesToServer(id, {
      ...tasks.find((task) => task.id === id),
      // Update the start time with the new start time
      startTime: updatedTasks.find((task) => task.id === id).startTime,
      // Set the task to active
      isActive: true,
    });
  };

  const handleStopTime = (id, newStopTime) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            // Add the new stop time to the existing stop times
            stopTime: [...task.stopTime, newStopTime],
            // Set the task to inactive
            isActive: false,
          }
        : task
    );
    // Update the tasks state
    setTasks(updatedTasks);

    // Send the updated task to the server
    sendChangesToServer(id, {
      ...tasks.find((task) => task.id === id),
      // Update the stop time with the new stop time
      stopTime: updatedTasks.find((task) => task.id === id).stopTime,
      // Set the task to inactive
      isActive: false,
    });
  };

  // ================================= Drag and Drop =============================================================
  // Save reordered tasks to server
  const sendNewOrderToServer = (unorderedTasks, reorderedTasks) => {
    for (var i = 0; i < reorderedTasks.length; i++) {
      sendChangesToServer(unorderedTasks[i].id, reorderedTasks[i]);
    }
  };

  // Functions for drag-and-drop logic
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("text/plain", taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetTaskId) => {
    // Prevent the default behavior of the browser during the drop event
    e.preventDefault();

    // Retrieve the task ID of the dragged task from the dataTransfer object
    const draggedTaskId = e.dataTransfer.getData("text/plain");

    // Create a copy of the existing tasks to work with without mutating the original state
    const originalTasks = [...tasks];
    const updatedTasks = [...tasks];

    // Find the indices of the dragged and target tasks within the updatedTasks array
    const draggedIndex = updatedTasks.findIndex(
      (task) => task.id == draggedTaskId
    );
    const targetIndex = updatedTasks.findIndex(
      (task) => task.id == targetTaskId
    );

    // If both dragged and target tasks are found in the array, proceed to reorder tasks
    if (draggedIndex !== -1 && targetIndex !== -1) {
      // Remove the dragged task from its original position
      const [draggedTask] = updatedTasks.splice(draggedIndex, 1);

      // Insert the dragged task at the target position, effectively reordering the tasks
      updatedTasks.splice(targetIndex, 0, draggedTask);

      // Update the 'tasks' state with the new order of tasks using the setTasks function
      setTasks(updatedTasks);

      // If you're using filtered tasks, update the 'filteredTasks' state with the same order
      if (filteredTasks) {
        const updatedFilteredTasks = [...filteredTasks];
        const draggedFilteredIndex = updatedFilteredTasks.findIndex(
          (task) => task.id == draggedTaskId
        );
        const targetFilteredIndex = updatedFilteredTasks.findIndex(
          (task) => task.id == targetTaskId
        );

        if (draggedFilteredIndex !== -1 && targetFilteredIndex !== -1) {
          const [draggedFilteredTask] = updatedFilteredTasks.splice(
            draggedFilteredIndex,
            1
          );
          updatedFilteredTasks.splice(
            targetFilteredIndex,
            0,
            draggedFilteredTask
          );
          setFilteredTasks(updatedFilteredTasks);
        }
      }

      sendNewOrderToServer(originalTasks, updatedTasks);
    }
  };

  // ================================= return ====================================================================
  return (
    <div>
      <TaskViewInstructions /> {/* This component displays the instructions */}
      <hr />
      <Filter tasks={tasks} setFilteredTasks={setFilteredTasks} />{" "}
      {/* This component filters tasks */}
      <hr />
      <div className="add-task-container">
        <h3>
          {filteredTasks.length} tasks displayed. Enter task details to create a
          new task:
        </h3>
        <div>
          {/* This updates the task name */}
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="task name"
            className="task-input"
          />
          {/* This updates the task tags */}
          <input
            type="text"
            value={newTags.join(",")}
            onChange={(e) => setNewTags(e.target.value.split(","))}
            placeholder="tag/tags separated by comma"
            className="task-input"
          />
          <button onClick={handleAddTask} className="add-task-button">
            {" "}
            {/* This button adds a new task */}
            Add new Task
          </button>
        </div>
      </div>
      {/* Display the message to the user */}
      {message && <div className="message">{message}</div>}
      <ol>
        {filteredTasks.map((task) => (
          <TaskElement
            key={task.id}
            taskId={task.id}
            name={task.name}
            tags={task.tags}
            isActive={task.isActive}
            tasks={tasks}
            handleRemoveTag={handleRemoveTag}
            handleAddTag={handleAddTag}
            handleRemoveTask={handleRemoveTask}
            handleEditTaskName={handleEditTaskName}
            handleStartTime={handleStartTime}
            handleStopTime={handleStopTime}
            singleTaskMode={singleTaskMode}
            draggable="true" // Set as draggable
            onDragStart={(e) => handleDragStart(e, task.id)} // Handle drag start event
            onDragOver={handleDragOver} // Handle drag over event
            onDrop={(e) => handleDrop(e, task.id)} // Handle drop event
            setTasks={setTasks}
          />
        ))}
      </ol>
    </div>
  );
};

export default Tasks;
