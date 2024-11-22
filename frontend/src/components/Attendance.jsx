import React, { useState, useEffect } from 'react';
import { Button, Table, Form } from 'react-bootstrap';
import 'bootswatch/dist/lux/bootstrap.min.css';
import axios from 'axios';
import CONFIG from '../config'; // Assuming CONFIG.BACKEND_URL is defined

const Attendance = () => {
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [currentDate] = useState(new Date().toLocaleDateString()); // Get current date
  const [month, setMonth] = useState('');
  const [monthSummary, setMonthSummary] = useState({}); // For storing month summary
  const [searchQuery, setSearchQuery] = useState(''); // State to hold the search query

  // Fetch employee data (assuming the backend returns a list of employees with ids and names)
  useEffect(() => {
    axios
      .get(`${CONFIG.BACKEND_URL}/attendance`) // Fetch employee list from backend
      .then((response) => setEmployees(response.data))
      .catch((error) => console.error('Error fetching employees:', error));
  }, []);

  // Fetch monthly attendance summary when month changes
  useEffect(() => {
    if (month) {
      // Extract the month number from the yyyy-mm format
      const monthNumber = month.split('-')[1]; // Get the month part from yyyy-mm

      axios
        .get(`${CONFIG.BACKEND_URL}/attendance/${monthNumber}`) // Fetch attendance summary for the month
        .then((response) => setMonthSummary(response.data))
        .catch((error) => console.error('Error fetching month summary:', error));
    }
  }, [month]);

  // Handle radio button change (attendance for each employee)
  const handleAttendanceChange = (employeeId, attendance) => {
    setAttendanceData((prevData) => {
      const updatedData = { ...prevData };
      updatedData[employeeId] = attendance;
      return updatedData;
    });
  };

  // Handle month input change (for summary of the month)
  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase()); // Convert search query to lowercase for case-insensitive matching
  };

  // Submit all attendance data
  const handleSubmitAttendance = () => {
    // Create the payload to submit attendance data
    const payload = {
      attendance: Object.keys(attendanceData).map((employeeId) => ({
        employee_id: parseInt(employeeId), // Convert key to number
        status: attendanceData[employeeId],
      }
    )),
    };

    // Post attendance data
    axios
      .post(`${CONFIG.BACKEND_URL}/attendance`, payload)
      .then(() => {
        alert('Attendance submitted successfully!');
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error submitting attendance:', error);
      });
      
  };

  // Filter employees based on search query
  const filteredEmployees = employees.filter((employee) =>
    employee.employee_id.toString().includes(searchQuery) || 
    employee.name.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Attendance Management</h1>
      
      {/* Search input */}
      <Form.Control
        type="text"
        placeholder="Search by Employee ID or Name"
        value={searchQuery}
        onChange={handleSearchChange}
        style={{ width: '300px', marginBottom: '20px' }}
      />
      {/* <div className="card text-white bg-success mb-2" style={{ maxWidth: "18rem" }}>
  <div className="card-header">{currentDate}</div>
  <div className="card-body">
    <h4 className="card-title">Today's Summary</h4>
    <p className="card-text">Present: </p>
    <p className="card-text">Absent: </p>
    <p className="card-text">Onleave: </p>
    <p className="card-text">Holiday: </p>
  </div>
</div> */}

      <div className="d-flex justify-content-between mb-4">
      <Button variant="primary" onClick={handleSubmitAttendance}>
        Submit Attendance
      </Button>
      <div className="card text-white bg-success mb-2" style={{ maxWidth: "10rem" }}>
  <div className="card-header">{currentDate}</div>
</div>
          
        <Form.Control
          type="month"
          value={month}
          onChange={handleMonthChange}
          placeholder="Select Month"
          style={{ width: '200px' }}
        />
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Attendance</th>
            <th>Month Summary</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee) => (
            <tr key={employee.employee_id}>
              <td>{employee.employee_id}</td>
              <td>{employee.name}</td>
              <td>
                <Form.Check
                  type="radio"
                  label="Present"
                  name={`attendance-${employee.employee_id}`}
                  value="Present"
                  checked={attendanceData[employee.employee_id] === 'Present'}
                  onChange={() => handleAttendanceChange(employee.employee_id, 'Present')}
                />
                <Form.Check
                  type="radio"
                  label="Absent"
                  name={`attendance-${employee.employee_id}`}
                  value="Absent"
                  checked={attendanceData[employee.employee_id] === 'Absent'}
                  onChange={() => handleAttendanceChange(employee.employee_id, 'Absent')}
                />
                <Form.Check
                  type="radio"
                  label="Leave"
                  name={`attendance-${employee.employee_id}`}
                  value="On Leave"
                  checked={attendanceData[employee.employee_id] === 'On Leave'}
                  onChange={() => handleAttendanceChange(employee.employee_id, 'On Leave')}
                />
                <Form.Check
                  type="radio"
                  label="Holiday"
                  name={`attendance-${employee.employee_id}`}
                  value="Holiday"
                  checked={attendanceData[employee.employee_id] === 'Holiday'}
                  onChange={() => handleAttendanceChange(employee.employee_id, 'Holiday')}
                />
              </td>
              <td>
                {monthSummary[employee.employee_id] ? (
                  <>
                    <div>Present: {monthSummary[employee.employee_id].present}</div>
                    <div>Absent: {monthSummary[employee.employee_id].absent}</div>
                    <div>Leave: {monthSummary[employee.employee_id].onleave}</div>
                    <div>Holiday: {monthSummary[employee.employee_id].holidays}</div>
                  </>
                ) : (
                  <span>No data available</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      
    </div>
  );
};

export default Attendance;
