# Time Tracker project

## Introduction

This project serves as the final assignment for the <5G00DM05-3004/3005 Full Stack Web Development> course. It focuses on creating a user-friendly React single-page application for tracking tasks, managing tags, and providing insights into time usage.

## Features

- Record and manage your tasks.
- Add and organize tags for your tasks.
- Analyze your working hours with summary statistics and charts.
- Responsive design for various screen sizes.

## Usage

1. Clone the repository to your local machine:
2. Run the backend server: `npx json-server -H localhost -p 3010 -w ./db.json`
3. Install dependencies and start the development server:
    
    ```
    npm install
    npm run dev
    ```
    
4. Open the application in your web browser at [http://localhost:3000](http://localhost:3000/).
5. Explore the application by clicking on tags in the navigation bar and following on-screen instructions.

## Log of Working

For a detailed log of the project's development and milestones, please refer to the "About" section within the application.

## Key technologies

1. **React Framework**: The entire application is built using React, a popular JavaScript library for building user interfaces, particularly single-page applications.
2. **Responsive Design**: Implementation of a responsive navigation bar and layout adjustments for different screen sizes, ensuring the application is usable on devices with varying screen sizes.
3. **React Router**: Utilization of **`react-router-dom`** for managing navigation within the application. This allows for the creation of unique addresses for each view, enhancing user experience and bookmarking capabilities.
4. **Local Backend with JSON Server**: Use of **`json-server`** to simulate a backend database using a local **`db.json`** file. This setup enables the handling of tasks and tags data.
5. **State Management**: Complex state management is required for features like the single mode, task activation/inactivation, and task management logic.
6. **CRUD Operations**: Implementation of Create, Read, Update, and Delete (CRUD) operations for tasks and tags. This includes sending HTTP requests (POST, GET, PUT, DELETE) to the backend server.
7. **User Interface Design**: Significant effort was put into designing an intuitive and clear user interface. This includes clear instructions, readable text, and a well-organized layout.
8. **Dynamic Time Tracking**: Features for tracking task activities and recording time, with functionalities to observe and summarize task activities within a user-defined interval.
9. **Interactive Elements**: Incorporation of interactive elements such as input fields, buttons for task filtering, and a dropdown list for tag selection.
10. **Drag-and-Drop Functionality**: Use of **`react-beautiful-dnd`** for adding drag-and-drop functionality, allowing users to rearrange task elements.
11. **Data Visualization**: Integration of **`react-chartjs-2`** and **`chart.js`** for displaying bar charts, providing visual summaries of daily activities and task durations.
12. **Adaptive UI Design**: Features to adapt the layout (e.g., header's layout change below certain screen width) and to change the application's theme, affecting UI colors.
13. **CSS and Styling Adjustments**: Responsive styling with adjustments for different screen sizes, including font size and padding changes.

## Link
The live site is available at https://jingjingyang0803.github.io/TimeTracker/
