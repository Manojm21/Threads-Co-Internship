import React, { useState, useEffect, useCallback } from 'react';
import { Button, Table, Form, Alert } from 'react-bootstrap';
import 'bootswatch/dist/lux/bootstrap.min.css';
import axios from 'axios';
import CONFIG from '../config';

const ATTENDANCE_STATUSES = ['Present', 'Absent', 'Holiday'];

const Attendance = () => {
  // State Management
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [monthSummary, setMonthSummary] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [specificDate, setSpecificDate] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const showAlert = (message, type) => {
    if (type === 'success') {
      setSuccess(message);
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const fetchEmployees = useCallback(async () => {
    try {
      const response = await axios.get(`${CONFIG.BACKEND_URL}/attendance`);
      console.log('Response data:', response.data);  // Debugging
      const fetchedEmployees = response.data.employees || [];
      setEmployees(fetchedEmployees);
  
      // Initialize attendance data
      const initialAttendance = fetchedEmployees.reduce((acc, emp) => {
        acc[emp.employee_id] = response.data.attendanceData?.[emp.employee_id] || 'Absent';
        return acc;
      }, {});
      setAttendanceData(initialAttendance);
    } catch (err) {
      showAlert('Error fetching employee data: ' + (err.response?.data?.message || err.message), 'error');
    }
  }, []);
  
  

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Fetch attendance for specific date
  const fetchSpecificDayAttendance = async () => {
    if (!specificDate) return;

    try {
      const response = await axios.get(`${CONFIG.BACKEND_URL}/attendance`, {
        params: { date: specificDate }
      });

      setAttendanceData(response.data.attendanceData || {});
      setIsEditing(false);
      showAlert(`Attendance data loaded for ${specificDate}`, 'success');
      calculateMonthlySummary(response.data.attendanceData);
    } catch (err) {
      showAlert('Error fetching attendance: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  // Calculate monthly summary
  const calculateMonthlySummary = (attendanceData) => {
    const summary = { Present: 0, Absent: 0, Holiday: 0 };

    Object.values(attendanceData).forEach(status => {
      if (status === 'Present') summary.Present++;
      else if (status === 'Absent') summary.Absent++;
      else if (status === 'Holiday') summary.Holiday++;
    });

    setMonthSummary(summary);
  };

  // Handle attendance change
  const handleAttendanceChange = (employeeId, status) => {
    if (!isEditing) return;

    setAttendanceData(prev => ({
      ...prev,
      [employeeId]: status
    }));
  };

  const handleSubmitAttendance = async () => {
    try {
      // Create payload for submission
      const payload = {
        attendance: Object.entries(attendanceData).map(([employee_id, status]) => ({
          employee_id: parseInt(employee_id, 10),
          status,
          date: specificDate
        }))
      };
  
      console.log('Submitting payload:', payload);  // Debugging
  
      // Make a POST request to submit the attendance
      await axios.post(`${CONFIG.BACKEND_URL}/attendance`, payload);
      showAlert('Attendance submitted successfully!', 'success');
      setIsEditing(false);
      fetchSpecificDayAttendance(); // Refresh data after submission
    } catch (err) {
      console.error('Submission error details:', err.response);  // Debugging
      showAlert('Error submitting attendance: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  // Filter employees based on search
  const filteredEmployees = employees.filter(employee =>
    employee.employee_id.toString().includes(searchQuery) ||
    employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Attendance Management</h1>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <div className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search by Employee ID or Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-100 mb-3"
        />

        <div className="d-flex gap-3 align-items-center">
          <Form.Control
            type="date"
            value={specificDate}
            onChange={(e) => setSpecificDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
          <Button
            variant="primary"
            onClick={fetchSpecificDayAttendance}
            disabled={!specificDate}
          >
            Fetch Attendance
          </Button>
          <Button
            variant={isEditing ? "secondary" : "info"}
            onClick={() => setIsEditing(!isEditing)}
            disabled={!specificDate}
          >
            {isEditing ? 'Cancel Edit' : 'Edit Attendance'}
          </Button>
          {isEditing && (
            <Button
              variant="success"
              onClick={handleSubmitAttendance}
            >
              Submit Changes
            </Button>
          )}
        </div>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Attendance Status</th>
            <th>Monthly Summary</th>
            
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee) => (
            <tr key={employee.employee_id}>
              <td>{employee.employee_id}</td>
              <td>{employee.name}</td>
              <td>
                <div className="d-flex gap-3">
                  {ATTENDANCE_STATUSES.map((status) => (
                    <Form.Check
                      key={`${employee.employee_id}-${status}`}
                      type="radio"
                      id={`${employee.employee_id}-${status}`}
                      label={status}
                      name={`attendance-${employee.employee_id}`}
                      checked={attendanceData[employee.employee_id] === status}
                      onChange={() => handleAttendanceChange(employee.employee_id, status)}
                      disabled={!isEditing}
                    />
                  ))}
                </div>
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
