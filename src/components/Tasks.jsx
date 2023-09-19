import React from "react";

const Tasks = () => {
  return (
    <div>
      <ul>
        <li>
          <b>Creating Tasks: </b>Click on the "Add Task" button to create a new
          task. Enter the task name and assign tags as needed.
        </li>
        <li>
          <b>Editing Tasks: </b>Select a task from the task list and click on
          the "Edit" button. Modify the task name and tags as desired.{" "}
        </li>
        <li>
          <b>Deleting Tasks: </b>In the task list, click on the "Delete" button
          next to the task you want to remove.
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

export default Tasks;
