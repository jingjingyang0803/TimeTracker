import React, { useState } from "react";

const AddTagForm = ({ onAddTag }) => {
  const [newTag, setNewTag] = useState("");

  const handleAddTag = () => {
    if (newTag.trim() !== "") {
      onAddTag(newTag.trim());
      setNewTag("");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={newTag}
        onChange={(e) => setNewTag(e.target.value)}
        placeholder="Enter a new tag"
      />
      <button onClick={handleAddTag}>Add Tag</button>
    </div>
  );
};

export default AddTagForm;
