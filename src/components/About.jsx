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
        summaries and charts of your time usage.
      </p>
      <hr />
      <p>
        <h3>Author: </h3>Jingjing Yang
        <h3>Working Hours Logs</h3>
        <ol>
          <li>
            Module A: 6h
            <ul>
              <li>
                - Created a page with 5 views that can be switched between using
                tags.
              </li>
              <li>
                - Implemented a responsive navigation bar that adapts to
                different screen sizes, including small screens.
              </li>
              <li>- Implemented unique addresses for each view.</li>
            </ul>
          </li>
        </ol>
      </p>
    </div>
  );
};

export default About;
