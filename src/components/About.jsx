import React from "react";

const About = () => {
  return (
    <div>
      <h2>Introduction</h2>
      <h3>
        Welcome to my final project of course{" "}
        <i>&lt;5G00DM05-3004/3005 Full Stack Web Development&gt;</i>!
      </h3>
      <p>
        This project focuses on creating a React single-page application for
        recording and analyzing working hours. <br />
        The application allows you to track your tasks, manage tags, and view
        summaries and charts of your time usage. <br />
      </p>
      <h3>Instructions for Using the Application: </h3>Please click the tags on
      the navigation above to check different views and follow the instructions
      provided on each view.
      <hr />
      <h3>
        What did you consider as the most difficult/tedious feature to
        implement?
      </h3>
      <p>
        The single mode feature was most difficult because it required deep
        understanding of task management logic and precise manipulation of
        state. Furthermore, the automatic deactivation of any active task (both
        on the server side and UI) upon activating a new one added complexity.
      </p>
      <p>
        ^ The most time-consuming task was designing the user interface,
        implementing the necessary components, and handling the logic for view
        switching.
      </p>
      <p>
        ^ I also faced challenges in improving the writing and ensuring clarity
        in the user interface text. This required careful consideration of the
        wording, structure, and overall readability of the instructions and
        labels, such as tag/feature naming, throughout the application.
      </p>
      <hr />
      <h3>Author: </h3>Jingjing Yang
      <h3> Log of Working Hours</h3>
      <ol>
        <li>
          Module A
          <ul>
            <li>
              Created a page with some views that can be switched between using
              tags.
            </li>
            <li>
              Implemented a responsive navigation bar that adapts to different
              screen sizes, including small screens.
            </li>
            <li> Implemented unique addresses for each view.</li>
            <li>
              <u>npm install react-router-dom</u>
            </li>
          </ul>
        </li>
        <li>
          Module B
          <ul>
            <li>
              Updated the "About" view, including the author's name, working
              hours log, and thoughts about implementation.
            </li>
            <li>
              Organized features to implement based on the project requirements.
            </li>
            <li> Provided instructions for using the application.</li>
          </ul>
        </li>
        <li>
          Module C
          <ul>
            <li>
              Added a file 'db.json' to the root directory to serve as the
              "database".
            </li>
            <li>Created tasks with related tags in the 'db.json' file.</li>
            <li>
              Run backend server:{" "}
              <u>npx json-server -H localhost -p 3010 -w ./db.json</u>
            </li>
            <li>
              <u>npm install json-server</u>
            </li>
            <li>
              Initialized the application by retrieving task data from a local
              backend json-server.
            </li>
          </ul>
        </li>
        <li>
          Module D
          <ul>
            <li>Added tag remove and tag add functionality. </li>
            <li>Implemented task remove and task add functionality.</li>
            <li>Enabled task name edit functionality.</li>
          </ul>
        </li>
        <li>
          Module E
          <ul>
            <li>
              Save edited task (adding/removing tags or editing task names) to
              backend server by sending a PUT request.
            </li>
            <li>
              Save removed task to backend server by sending a DELETE request.
            </li>
            <li>
              Save newly added task to backend server by sending a POST request.
            </li>
          </ul>
        </li>
        <li>
          Module F
          <ul>
            <li>Add an input field to collect selected tags from the user.</li>
            <li>
              Include a button that allows the user to filter tasks based on
              tags.
            </li>
            <li>
              Include a button that allows the user to check all the tasks.
            </li>
          </ul>
        </li>
        <li>
          Module G
          <ul>
            <li>
              Enabled the ability to add a tag from a dropdown list containing
              existing tags.
            </li>
            <li>Disabled the tag option if the current task already has it.</li>
            <li>Kept the option for the user to create a new tag.</li>
            <li>
              Reset the select list to an empty value after each selection.
            </li>
            <li>
              Upgrade the task filtering section by adding a set of checkboxes.
            </li>
            <li>
              <u>npm install react-beautiful-dnd</u>
            </li>
            <li>Allow user to rearrange task elements order.</li>
          </ul>
        </li>
        <li>
          Module H
          <ul>
            <li>Implement task activation and inactivation functionality.</li>
            <li>Implement task activity tracking and time recording.</li>
          </ul>
        </li>
        <li>
          Module I
          <ul>
            <li>
              Set up an observation interval that, by default, covers the
              current day from its start to the current time (dynamic). This
              interval can be freely modified by the user.
            </li>
            <li>
              Calculated tasks of interest, meaning tasks that were active at
              some point during the observation interval.
            </li>
            <li>
              Provided summary details about the total active times for each
              task of interest within the observation interval.
            </li>
            <li>
              Provided summary details about the total active times for each tag
              of interest(tags associated with the tasks of interest) within the
              observation interval.
            </li>
          </ul>
        </li>
        <li>
          Module J
          <ul>
            <li>
              Implement a feature that enables users to set the interval for
              task details.
            </li>
            <li>
              Add a feature that shows a list of active intervals within the
              selected time frame.
            </li>
          </ul>
        </li>
        <li>
          Module K
          <ul>
            <li>
              Implement a feature that allows users to set the interval for the
              daily activity chart.
            </li>
            <li>
              <u>npm install react-chartjs-2</u>; <u>npm install chart.js</u>
            </li>
            <li>
              Add a feature to display bar charts that show daily activity times
              for selected tasks.
            </li>
          </ul>
        </li>
        <li>
          Module L
          <ul>
            <li>
              Implemented feature to change application theme affecting UI
              colors.
            </li>
            <li>Implemented feature for single activating modes.</li>
          </ul>
        </li>
        <li>
          Module M
          <ul>
            <li>Header's layout changes from a row to a column below 720px.</li>
            <li>Adjust font size and padding for different screen sizes.</li>
          </ul>
        </li>
      </ol>
    </div>
  );
};

export default About;
