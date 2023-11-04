import React, { useRef, useState } from "react";

const TaskElement = ({
  taskId,
  name,
  tags,
  isActive,
  tasks,
  handleRemoveTag,
  handleAddTag,
  handleRemoveTask,
  handleEditTaskName,
  handleStartTime,
  handleStopTime,
  draggable,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  // ================================= Edit Task Name ============================================================
  const [editingTask, setEditingTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState(name); // Initialize newTaskName with the existing task name
  const [nameError, setNameError] = useState(""); // State to store the name error message
  const [tagError, setTagError] = useState("");

  // Function to start editing the task name
  const startEditingTaskName = () => {
    setEditingTask(true);

    setTagError(""); // Clear the error message
  };

  // Function to save the edited task name
  const saveTaskName = () => {
    if (newTaskName.trim() === "") {
      setNameError(
        "Task name cannot be empty. Please enter a valid task name."
      );
    } else {
      handleEditTaskName(taskId, newTaskName);
      setEditingTask(false);
      setNameError(""); // Clear the error message
    }
  };

  // Function to cancel editing the task name
  const cancelEditingTaskName = () => {
    setEditingTask(false);
    setNewTaskName(name); // Reset the input field to the existing task name
    setNameError(""); // Clear the error message
  };

  // ================================= Remove Task ===============================================================
  const removeTask = () => {
    handleRemoveTask(taskId); // Calls the handleRemoveTask function with taskId as argument
  };

  // ================================= Add/Remove Tag ============================================================
  // Function to add a new tag
  const addTag = () => {
    const existingTags = [];
    // For each task
    tasks.forEach((task) => {
      // For each tag in the task
      task.tags.forEach((tag) => {
        // If tag not already in the list
        if (!existingTags.includes(tag)) {
          existingTags.push(tag); // Add the tag to the list
        }
      });
    });

    // Create a reference to the select element
    const selectRef = useRef(null); // Reference to store the select element

    const handleTagSelection = (selectedTag) => {
      // If selected tag is not 'Custom'
      if (selectedTag !== "Custom") {
        // Pass the selectedTag value to the handleAddTag function
        handleAddTag(taskId, selectedTag);
      } else {
        // Prompt the user to enter a new tag
        const newTag = prompt("Enter a new tag:");

        if (newTag !== null) {
          const trimmedTag = newTag.trim();
          // If trimmed tag is not empty
          if (trimmedTag !== "") {
            // Pass the trimmedTag value to the handleAddTag function
            handleAddTag(taskId, trimmedTag);
          } else {
            // Alert if tag is empty
            alert("Tag cannot be empty. Please enter a valid tag.");
          }
        } else {
          console.log("User clicked Cancel");
        }
      }

      // Reset the select list to an empty value
      selectRef.current.value = "";

      setTagError(""); // Clear the error message
    };

    // Return select element with existing tags and option to add custom tag
    return (
      <select
        defaultValue=""
        onChange={(e) => handleTagSelection(e.target.value)}
        ref={selectRef}
      >
        <option value="" disabled>
          Add a new tag...
        </option>
        {existingTags.map((tag, index) => (
          // Disable tag if it's already included
          <option key={index} value={tag} disabled={tags.includes(tag)}>
            {tag}
          </option>
        ))}
        <option value="Custom">Custom</option>
      </select>
    );
  };

  const removeTag = (index) => {
    if (tags.length === 1) {
      setTagError(
        "Cannot remove the last tag. Task must have at least one tag."
      );
    } else {
      handleRemoveTag(taskId, index); // Calls the function to remove the tag
      setTagError(""); // Clear the error message
    }
  };

  // ================================= Activate/Deactivate Task ==================================================

  const toggleTask = () => {
    const currentTime = new Date().toISOString(); // Get the current time in ISO 8601 format

    if (isActive) {
      // Checks if task is active
      handleStopTime(taskId, currentTime); // Calls the handleStopTime function with taskId and newStopTime as arguments
    } else {
      handleStartTime(taskId, currentTime); // Calls the handleStartTime function with taskId and newStartTime as arguments
    }
    setTagError(""); // Clear the error message
  };

  // ================================= return ====================================================================
  return (
    <div
      className={`task ${isActive ? "active" : ""}`}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {/* Apply 'active' class if task is active */}

      {/*" =========================== Buttons =============================================================== */}
      {editingTask ? (
        <div>
          <input
            type="text"
            value={newTaskName}
            onChange={(e) => {
              setNewTaskName(e.target.value);
              setNameError(""); // Clear the error message when the user starts typing
            }}
          />
          <button onClick={saveTaskName}>Save</button>
          <button onClick={cancelEditingTaskName}>Cancel</button>
        </div>
      ) : (
        <button onClick={startEditingTaskName} className="task-edit">
          {/* Button to trigger task name editing */}
          Edit task name
        </button>
      )}
      {nameError && <div className="error-message">{nameError}</div>}

      <button onClick={removeTask} className="task-remove">
        {" "}
        {/* Button to remove task */}
        Remove task
      </button>

      {/* Toggle between active and inactive task */}
      <button
        onClick={toggleTask}
        className={`task-toggle ${isActive ? "active-button" : ""}`}
      >
        {/* Apply 'active-button' class if task is active */}
        {isActive ? "Deactivate" : "Activate"}{" "}
        {/* Change button text based on task's active status */}
      </button>

      {/*" =========================== Task Details ========================================================== */}
      <div className="task-name">
        {" "}
        {/* Display task name */}
        <b>Task Name: </b>
        <i>{name}</i>
      </div>
      <div className="task-tags">
        {" "}
        {/* Display task tags */}
        <b> Tags: </b>
        {tags.map((tag, index) => (
          <span key={index}>
            {tag}{" "}
            <button onClick={() => removeTag(index)} className="tag-remove">
              {" "}
              {/* Button to remove a tag */}x
            </button>
          </span>
        ))}
        {addTag()}{" "}
        {/* Render the addTag function to display the select input for adding a new tag */}
        {tagError && <div className="error-message">{tagError}</div>}
      </div>
    </div>
  );
};
export default TaskElement;
