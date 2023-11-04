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

  const [newTag, setNewTag] = useState("");

  const [customTagInput, setCustomTagInput] = useState(false);
  const [customTag, setCustomTag] = useState(""); // Separate state for custom tag input
  const [addTagError, setAddTagError] = useState(""); // State to store the name error message

  // Function to start editing the task name
  const startEditingTaskName = () => {
    setEditingTask(true);

    setCustomTagInput(false); // Hide the custom tag input
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

  // ================================= Add Tag ===================================================================
  // Function to cancel editing the tag name
  const cancelEditingTagName = () => {
    setCustomTagInput(false);
    setAddTagError(""); // Clear the error message
  };

  //Function to add a new tag
  const addTag = () => {
    const existingTags = [];
    //For each task
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
      if (selectedTag !== "Custom") {
        // Pass the selectedTag value to the handleAddTag function
        handleAddTag(taskId, selectedTag);
        setCustomTagInput(false); // Hide the custom tag input
      } else {
        // If "Custom" is selected, show the custom tag input
        setCustomTagInput(true);
      }

      // Reset the select list to an empty value
      selectRef.current.value = "";

      setEditingTask(false); // Hide the edit task name input
      setTagError(""); // Clear the error message
      setAddTagError(""); // Clear the error message
    };

    const saveCustomTag = () => {
      if (customTag.trim() === "") {
        setAddTagError(
          "Tag name cannot be empty. Please enter a valid tag name."
        );
      } else if (tags.includes(customTag)) {
        setAddTagError("This task already has this tag.");
      } else {
        handleAddTag(taskId, customTag);
        setCustomTagInput(false); // Hide the custom tag input
        setCustomTag(""); // Clear the custom tag input field
        setAddTagError(""); // Clear the error message
      }
    };

    // Return select element with existing tags and option to add custom tag
    return (
      <div>
        <select
          defaultValue=""
          onChange={(e) => handleTagSelection(e.target.value)}
          ref={selectRef}
        >
          <option value="" disabled>
            Add a new tag...
          </option>
          {existingTags.map((tag, index) => (
            <option key={index} value={tag} disabled={tags.includes(tag)}>
              {tag}
            </option>
          ))}
          <option value="Custom">Custom</option>
        </select>

        {customTagInput && (
          <div className="custom-tag-div">
            <input
              type="text"
              value={customTag}
              placeholder="Enter a new Tag"
              onChange={(e) => {
                setCustomTag(e.target.value);
                setAddTagError(""); // Clear the error message when the user starts typing
              }}
              autoFocus
            />
            <button onClick={saveCustomTag}>Save</button>
            <button onClick={cancelEditingTagName}>Cancel</button>
          </div>
        )}

        {addTagError && <div className="error-message">{addTagError}</div>}
      </div>
    );
  };

  // ================================= Remove Tag ================================================================
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
        <div className="edit-task-div">
          <input
            type="text"
            value={newTaskName}
            placeholder="Enter new Task name"
            onChange={(e) => {
              setNewTaskName(e.target.value);
              setNameError(""); // Clear the error message when the user starts typing
            }}
            autoFocus
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
        {tagError && <div className="error-message">{tagError}</div>}
        {addTag()}{" "}
        {/* Render the addTag function to display the select input for adding a new tag */}
      </div>
    </div>
  );
};
export default TaskElement;
