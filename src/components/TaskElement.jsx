import React, { useRef, useState } from "react";

const TaskElement = ({
  taskId,
  name,
  tags,
  handleRemoveTag,
  handleAddTag,
  handleRemoveTask,
  handleEditTaskName,
  tasks,
  handleStartTime,
  handleStopTime,
}) => {
  const [isActive, setIsActive] = useState(false);

  // ================================= Edit Task Name/Remove Task ==========================================================
  const editTaskName = () => {
    const newTaskName = prompt("Enter a new task name:"); // Prompts the user to enter a new task name

    if (newTaskName !== null) {
      // Checks if user input is not null
      const trimmedTaskName = newTaskName.trim(); // Removes extra spaces from the user input
      if (trimmedTaskName !== "") {
        // Checks if trimmed task name is not empty
        console.log("New Task Name:", trimmedTaskName); // Logs the new task name
        handleEditTaskName(taskId, trimmedTaskName); // Calls the handleEditTaskName function with taskId and trimmedTaskName as arguments
      } else {
        alert("Task name cannot be empty. Please enter a valid task name."); // Alerts the user if task name is empty
      }
    } else {
      console.log("User clicked Cancel"); // Logs when user cancels the prompt
    }
  };

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
        console.log("Selected Tag:", selectedTag);
        // Pass the selectedTag value to the handleAddTag function
        handleAddTag(taskId, selectedTag);
      } else {
        // Prompt the user to enter a new tag
        const newTag = prompt("Enter a new tag:");

        if (newTag !== null) {
          const trimmedTag = newTag.trim();
          // If trimmed tag is not empty
          if (trimmedTag !== "") {
            console.log("New Tag:", trimmedTag);
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
    console.log("Remove tag function called"); // Logs the function call
    console.log("Clicked Tag:", tags[index]); // Logs the clicked tag
    handleRemoveTag(taskId, index); // Calls the function to remove the tag
  };

  // ================================= Activate/Deactivate Task ==================================================
  const toggleTask = () => {
    if (isActive) {
      // Checks if task is active
      const newStopTime = new Date().getTime(); // Gets the current time in milliseconds
      handleStopTime(taskId, newStopTime); // Calls the handleStopTime function with taskId and newStopTime as arguments
      setIsActive(false); // Sets the task to inactive
    } else {
      const newStartTime = new Date().getTime(); // Gets the current time in milliseconds
      handleStartTime(taskId, newStartTime); // Calls the handleStartTime function with taskId and newStartTime as arguments
      setIsActive(true); // Sets the task to active
    }
  };

  // ================================= return ====================================================================
  return (
    <div className={`task ${isActive ? "active" : ""}`}>
      {/*" =========================== Buttons =============================================================== */}
      {/* Apply 'active' class if task is active */}
      <button onClick={editTaskName} className="task-edit">
        {" "}
        {/* Button to trigger task name editing */}
        Edit task name
      </button>
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
        {name}
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
      </div>
    </div>
  );
};
export default TaskElement;
