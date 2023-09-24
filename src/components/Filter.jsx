import React, { useState } from "react";
import "../styles/Filter.css";

const Filter = ({ tasks, setFilteredTasks }) => {
  const [inputTag, setInputTag] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const handleSelectTag = () => {
    if (inputTag.trim() !== "") {
      setSelectedTags([...selectedTags, inputTag.trim()]);
      setInputTag("");
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
    console.log(tasks);
    setFilteredTasks(tasks); // Show all tasks
  };

  return (
    <div className="filter-tasks-container">
      <input
        type="text"
        value={inputTag}
        onChange={(e) => setInputTag(e.target.value)}
      />
      <button onClick={handleSelectTag}>Add Tag</button>
      {selectedTags.map((tag, index) => (
        <span key={index}>{tag}, </span>
      ))}
      <button onClick={handleFilter}>Filter</button>
      <button onClick={handleShowAllTasks}>Show All Tasks</button>
    </div>
  );
};

export default Filter;
