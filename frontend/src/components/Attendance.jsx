import React, { useState, useEffect } from 'react';
import { Button, Table, Form } from 'react-bootstrap';
import 'bootswatch/dist/lux/bootstrap.min.css';
import axios from 'axios';
import CONFIG from '../config'; // Assuming CONFIG.BACKEND_URL is defined
import AutoDismissAlert from '../components/AutoDismissAlert'; // Import the utility component
import { showAlert } from '../utils/alertUtils'; // Ensure this utility is implemented

const Attendance = () => {
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [month, setMonth] = useState('');
  const [monthSummary, setMonthSummary] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceRecorded, setAttendanceRecorded] = useState(false);
  const [isHoliday, setIsHoliday] = useState(false);
  const [canEditAttendance, setCanEditAttendance] = useState(true); // New state for editing permission

  const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

  useEffect(() => {
    axios
      .get(`${CONFIG.BACKEND_URL}/attendance`)
      .then((response) => {
        const employees = response.data.employees || [];
        setEmployees(employees);

        // Initialize attendanceData with default status for all employees
        const initialAttendance = employees.reduce((acc, employee) => {
          acc[employee.employee_id] = 'Absent'; // Set default status here
          return acc;
        }, {});
        setAttendanceData(initialAttendance);

        setAttendanceRecorded(response.data.attendanceRecorded || false);
      })
      .catch((error) => {
        console.error('Error fetching employees:', error);
        showAlert('Error fetching employee data.', 'danger');
      });
  }, []);

  useEffect(() => {
    if (month) {
      const monthNumber = month.split('-')[1];
      axios
        .get(`${CONFIG.BACKEND_URL}/attendance/${monthNumber}`)
        .then((response) => setMonthSummary(response.data))
        .catch((error) => {
          console.error('Error fetching month summary:', error);
          showAlert('Failed to fetch monthly attendance summary.', 'danger');
        });
    }
  }, [month]);

  // Handle attendance change (present, absent, holiday)
  const handleAttendanceChange = (employeeId, status) => {
    setAttendanceData((prevData) => ({
      ...prevData,
      [employeeId]: status,
    }));
  };

  const isAttendanceComplete = () => {
    return employees.every((employee) => attendanceData[employee.employee_id]);
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
        // showAlert('Attendance submitted successfully!', 'success');
        setAttendanceRecorded(true);
        setAttendanceData({});
      })
      .catch((error) => {
        const errorMsg =
          error.response?.data?.message || 'Error submitting attendance.';
        console.error(errorMsg, error);
        showAlert(errorMsg, 'danger');
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

  const handleHolidayChange = () => {
    setIsHoliday(!isHoliday);
    const holidayAttendance = employees.reduce((acc, employee) => {
      acc[employee.employee_id] = isHoliday ? 'Absent' : 'Holiday'; // Toggle between Holiday and Absent
      return acc;
    }, {});
    setAttendanceData(holidayAttendance);
  };

  // Check if attendance can be edited (only for today)
  useEffect(() => {
    if (attendanceRecorded) {
      const attendanceDate = new Date(currentDate);
      const today = new Date().toISOString().split('T')[0];
      if (today !== currentDate) {
        setCanEditAttendance(false); // Disable editing if it's not the present day
      }
    }
  }, [attendanceRecorded]);

  return (
    <div className="container mt-4 zindex-1">
      <h1 className="text-center mb-4">Attendance Management</h1>
      
      {/* Attendance recorded message */}
      {attendanceRecorded && (
        <AutoDismissAlert
          variant="success"
          message={`Attendance for today (${currentDate}) has already been recorded.`}
          duration={3000}
        />
      )}

      <Form.Control
        type="text"
        placeholder="Search by Employee ID or Name"
        value={searchQuery}
        onChange={handleSearchChange}
        style={{ width: '300px', marginBottom: '20px' }}
      />

      <div className="d-flex justify-content-between mb-4">
        <Button
          variant="primary"
          onClick={handleSubmitAttendance}
          disabled={attendanceRecorded || !isAttendanceComplete()}
        >
          Submit Attendance
        </Button>
        <Form.Check
          type="checkbox"
          checked={isHoliday}
          onChange={handleHolidayChange}
          label="Today is Holiday"
        />
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
                {['Present', 'Absent','Half Day', 'Holiday'].map((status) => (
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
                    disabled={!canEditAttendance} // Disable editing if attendance can't be edited
                  />
                ))}
              </td>
              <td>
                {monthSummary[employee.employee_id] ? (
                  <>
                    <div>Present: {monthSummary[employee.employee_id].present}</div>
                    <div>Absent: {monthSummary[employee.employee_id].absent}</div>
                    <div>Half Day: {monthSummary[employee.employee_id].halfDay}</div>
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
