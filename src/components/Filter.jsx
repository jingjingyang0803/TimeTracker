import React, { useState } from "react";
import "../styles/Filter.css";

const Filter = ({ tasks, setFilteredTasks }) => {
  const [selectedTags, setSelectedTags] = useState([]);

  const existingTags = [];
  tasks.forEach((task) => {
    task.tags.forEach((tag) => {
      if (!existingTags.includes(tag)) {
        existingTags.push(tag);
      }
    });
  });
  const handleSelectTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(
        selectedTags.filter((selectedTag) => selectedTag !== tag)
      );
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleFilter = () => {
    const filteredTasks = tasks.filter((task) => {
      return selectedTags.every((tag) => task.tags.includes(tag));
    });
    setFilteredTasks(filteredTasks);
  };

  const handleShowAllTasks = () => {
    setSelectedTags([]); // Reset the selected tags to an empty array
    setFilteredTasks(tasks); // Show all tasks
  };

  return (
    <div className="filter-tasks-container">
      {existingTags.map((tag, index) => (
        <label key={index}>
          <input
            type="checkbox"
            checked={selectedTags.includes(tag)}
            onChange={() => handleSelectTag(tag)}
          />
          {tag}
        </label>
      ))}
      <button className="filter-button" onClick={handleFilter}>
        Filter
      </button>
      <button className="show-all-button" onClick={handleShowAllTasks}>
        Show All Tasks
      </button>
    </div>
  );
};

export default Filter;
