# Employee Management System

A comprehensive **Employee Management System** built with a **React.js** frontend and an **Express.js** backend, integrating **MySQL** for the database. This project enables the management of employee details, including creating, editing, viewing, and deleting employee records. Additionally, it offers features for salary and attendance management.

## Features

- **Employee Management:**
  - Add, edit, and delete employee details.
  - Manage employee-specific information like name, gender, phone number, role, salary, etc.

- **Salary Management:**
  - View employee salary details by month.
  - Integrated error handling for incomplete attendance records.

- **Attendance Management:**
  - Supports holiday marking and employee attendance tracking.

- **Responsive Design:**
  - Fully functional across desktop and mobile devices.

## Tech Stack

### Frontend
- **React.js**: Framework for building the user interface.
- **Bootstrap**: For responsive and modern UI components.

### Backend
- **Express.js**: Framework for handling API requests.
- **MySQL**: Relational database for data storage.
- **Axios**: For handling HTTP requests.

## Installation

### Prerequisites
- **Node.js** (>=14.x)
- **MySQL** installed and running
- Git (to clone the repository)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Shre-sg/Internship.git
   cd Internship
   ```
   
2. Backend Setup
   - Navigate to backend folder
     
   ```bash
   cd backend
   ```
   
   - Install dependencies
     
   ```bash
   npm install
   ```
   
   - Configure the database connection: Update the credentials in the .env file
     
   ```bash
   DB_HOST=<localhost>
   DB_USER=<root>
   DB_PASSWORD=<yourpassword>
   DB_NAME=<employeedb>
   ```
   
   - Running the backend server after using a custom script (optional)
     
    1. Add the dev script under scripts in package.json file
       
   ```
   {"dev": "node app.js"}
   ```
   2. Run the script using the following command
      
   ```bash
   npm run dev
   ```
   - Running without the dev script in package.json file (Directly running it)
     
   ```bash
   node app.js
   ```

3. Frontend Setup
   - Navigate to frontend folder
   
   ```bash
   cd frontend
   ```
   - Install dependencies
     
   ```bash
   npm install
   ```
   - Configure the backend API URL in the config.js file:
     
   ```bash
   const CONFIG = {
    BACKEND_URL: <Enter your backend URL here>
   };
   export default CONFIG;
   ```
   - Running the frontend server after adding the dev script in package.json file
     
   ```bash
   npm run dev
   ```
