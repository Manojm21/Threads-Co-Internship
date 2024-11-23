import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Alert } from 'react-bootstrap';
import 'bootswatch/dist/lux/bootstrap.min.css';
import axios from 'axios';
import CONFIG from '../config'; // Assuming CONFIG.BACKEND_URL is defined

const Attendance = () => {
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [month, setMonth] = useState('');
  const [monthSummary, setMonthSummary] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceRecorded, setAttendanceRecorded] = useState(false);

  const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

  // Fetch employee data and check if today's attendance has been recorded
  useEffect(() => {
    axios
      .get(`${CONFIG.BACKEND_URL}/attendance`)
      .then((response) => {
        setEmployees(response.data.employees || []);
        setAttendanceRecorded(response.data.attendanceRecorded || false);
      })
      .catch((error) => console.error('Error fetching employees:', error));
  }, []);

  // Fetch monthly attendance summary
  useEffect(() => {
    if (month) {
      const monthNumber = month.split('-')[1];
      axios
        .get(`${CONFIG.BACKEND_URL}/attendance/${monthNumber}`)
        .then((response) => setMonthSummary(response.data))
        .catch((error) => console.error('Error fetching month summary:', error));
    }
  }, [month]);

  const handleAttendanceChange = (employeeId, status) => {
    setAttendanceData((prevData) => ({
      ...prevData,
      [employeeId]: status,
    }));
  };

  const handleSubmitAttendance = () => {
    const payload = {
      attendance: Object.entries(attendanceData).map(([employeeId, status]) => ({
        employee_id: parseInt(employeeId, 10),
        status,
      })),
    };

    axios
      .post(`${CONFIG.BACKEND_URL}/attendance`, payload)
      .then(() => {
        alert('Attendance submitted successfully!');
        window.location.reload();
      })
      .catch((error) => {
        if (error.response?.data?.message) {
          alert(error.response.data.message);
        } else {
          console.error('Error submitting attendance:', error);
        }
      });
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.employee_id.toString().includes(searchQuery) ||
      employee.name.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="container mt-4 zindex-1">
      <h1 className="text-center mb-4">Attendance Management</h1>

      {/* Attendance recorded message */}
      {attendanceRecorded && (
        <Alert variant="success" style={{position: 'relative',zIndex:'1'}}>
          Attendance for today ({currentDate}) has already been recorded.
        </Alert>
      )}

      <Form.Control
        type="text"
        placeholder="Search by Employee ID or Name"
        value={searchQuery}
        onChange={handleSearchChange}
        style={{ width: '300px', marginBottom: '20px' }}
      />

      <div className="d-flex justify-content-between mb-4">
        <Button variant="primary" onClick={handleSubmitAttendance}>
          Submit Attendance
        </Button>
        <Form.Control
          type="month"
          value={month}
          onChange={handleMonthChange}
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
                {['Present', 'Absent', 'On Leave', 'Holiday'].map((status) => (
                  <Form.Check
                    type="radio"
                    label={status}
                    name={`attendance-${employee.employee_id}`}
                    value={status}
                    checked={attendanceData[employee.employee_id] === status}
                    onChange={() =>
                      handleAttendanceChange(employee.employee_id, status)
                    }
                    key={status}
                  />
                ))}
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
