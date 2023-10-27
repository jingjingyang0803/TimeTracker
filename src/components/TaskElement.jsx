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
  const [isActive, setIsActive] = useState(false); // State to track the task's active status

  const removeTag = (index) => {
    console.log("Remove tag function called");
    console.log("Clicked Tag:", tags[index]);
    handleRemoveTag(taskId, index);
  };

  // Function to add a new tag
  const addTag = () => {
    const existingTags = [];
    tasks.forEach((task) => {
      task.tags.forEach((tag) => {
        if (!existingTags.includes(tag)) {
          existingTags.push(tag);
        }
      });
    });

    // Create a reference to the select element
    const selectRef = useRef(null); // Ref to store the reference to the select element

    const handleTagSelection = (selectedTag) => {
      if (selectedTag !== "Custom") {
        console.log("Selected Tag:", selectedTag);
        handleAddTag(taskId, selectedTag); // Pass the selectedTag value to the handleAddTag function
      } else {
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
      }

      selectRef.current.value = ""; // Reset the select list to an empty value
    };

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
          <option key={index} value={tag} disabled={tags.includes(tag)}>
            {tag}
          </option>
        ))}
        <option value="Custom">Custom</option>
      </select>
    );
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

  const toggleTask = () => {
    if (isActive) {
      setIsActive(false);
      const newStopTime = new Date().getTime();
      handleStopTime(taskId, newStopTime);
    } else {
      setIsActive(true);
      const newStartTime = new Date().getTime();
      handleStartTime(taskId, newStartTime);
    }
  };

  return (
    <div className={`task ${isActive ? "active" : ""}`}>
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
        {addTag()}{" "}
        {/* Render the addTag function to display the select input */}
      </div>

      <button onClick={removeTask} className="task-remove">
        Remove
      </button>

      <button
        onClick={toggleTask}
        className={`task-toggle ${isActive ? "active-button" : ""}`}
      >
        {isActive ? "Deactivate" : "Activate"}{" "}
        {/* Toggle button text based on the active status */}
      </button>

      {/* <div className="active-time">Total Active Time: {activeTime} seconds</div> */}
    </div>
  );
};
export default TaskElement;
