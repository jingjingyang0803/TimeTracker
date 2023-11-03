import React, { useState } from "react";

const Filter = ({ tasks, setFilteredTasks }) => {
  const [selectedTags, setSelectedTags] = useState([]);

  // ================================= Existing tags ==============================================================
  const existingTags = [];

  // Loop through each task
  tasks.forEach((task) => {
    // For each task, loop through its tags
    task.tags.forEach((tag) => {
      // If the tag doesn't already exist in our array of existing tags, add it
      if (!existingTags.includes(tag)) {
        existingTags.push(tag);
      }
    });
  });

  // ================================= Filter Tasks ==============================================================
  const handleSelectTag = (tag) => {
    // If the selected tag is already in the array, remove it
    if (selectedTags.includes(tag)) {
      setSelectedTags(
        selectedTags.filter((selectedTag) => selectedTag !== tag)
      );
    } else {
      // Otherwise, add the selected tag to the array
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleFilter = () => {
    // Filter tasks to only include those that have every selected tag
    const filteredTasks = tasks.filter((task) => {
      return selectedTags.every((tag) => task.tags.includes(tag));
    });

    // Update the state to display the filtered tasks
    setFilteredTasks(filteredTasks);
  };

  // ================================= Show All Tasks ===========================================================
  const handleShowAllTasks = () => {
    // Reset the selected tags to an empty array
    setSelectedTags([]);
    // Show all tasks
    setFilteredTasks(tasks);
  };

  // ================================= Return ===================================================================
  return (
    <div>
      <div className="filter-tasks-container">
        <br />
        {/* Map through all existing tags */}
        {existingTags.map((tag, index) => (
          <label key={index}>
            {/* Checkbox for each tag */}
            <input
              type="checkbox"
              // Check if the tag is included in the selected tags
              checked={selectedTags.includes(tag)}
              // On change, handle the selection of the tag
              onChange={() => handleSelectTag(tag)}
            />
            {/* Display the tag name */}
            {tag}
          </label>
        ))}
      </div>

      {/* Button that triggers the filter function */}
      <button className="filter-button" onClick={handleFilter}>
        Filter tasks with selected tags
      </button>
      <br />

      {/* Button that triggers the show all tasks function */}
      <button className="show-all-button" onClick={handleShowAllTasks}>
        Show All Tasks
      </button>
    </div>
  );
};

export default Filter;
