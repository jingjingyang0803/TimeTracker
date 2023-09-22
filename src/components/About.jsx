import React from "react";

const About = () => {
  return (
    <div>
      <h2>Introduction</h2>
      <p>
        Welcome to the 5G00DM05-3004/3005 <b>Full Stack Web Development </b>
        final project! <br />
        This project focuses on creating a React single-page application for
        recording and analyzing working hours. <br />
        The application allows you to track your tasks, manage tags, and view
        summaries and charts of your time usage. <br />
      </p>
      <hr />
      <h3>Instructions for Using the Application: </h3>Please click the tags on
      the navigation above to check different views and follow the instructions
      provided on each view.
      <hr />
      <h3>My answer to Module B question: </h3>
      <h4>
        What did you consider as the most difficult/tedious feature to
        implement?
      </h4>
      <p>
        ^ The most time-consuming task was creating a page with 5 views that can
        be switched between using tags. This involved designing the user
        interface, implementing the necessary components, and handling the logic
        for view switching. .
      </p>
      <p>
        ^ I also faced challenges in improving the writing and ensuring clarity
        in the user interface text. This required careful consideration of the
        wording, structure, and overall readability of the instructions and
        labels, such as tag/feature naming, throughout the application.
      </p>
      <p>
        ^ I expect that the most difficult task will be implementing real-time
        communication with the server-side and saving changes. This will involve
        working with server-side technologies and effectively managing data
      </p>
      <hr />
      <h3>Author: </h3>Jingjing Yang
      <h3>Working Hours Logs</h3>
      <ol>
        <li>
          Module A: 6h
          <ul>
            <li>
              Created a page with 5 views that can be switched between using
              tags.
            </li>
            <li>
              Implemented a responsive navigation bar that adapts to different
              screen sizes, including small screens.
            </li>
            <li> Implemented unique addresses for each view.</li>
            <li>npm install react-router-dom</li>
          </ul>
        </li>
        <li>
          Module B: 3h
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
          Module C: 5h
          <ul>
            <li>
              Added a file 'db.json' to the root directory to serve as the
              "database".
            </li>
            <li>Created tasks with related tags in the 'db.json' file.</li>
            <li>
              Run backend server: npx json-server -H localhost -p 3010 -w
              ./db.json
            </li>
            <li>npm install json-server</li>
            <li>
              Initialized the application by retrieving task data from a local
              backend json-server.
            </li>
          </ul>
        </li>
        <li>
          Module D:
          <ul>
            <li>Implemented tag remove and tag add functionality.</li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </li>
      </ol>
    </div>
  );
};

export default About;
