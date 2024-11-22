import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Container, Row, Col, Button, Form } from 'react-bootstrap';
import 'bootswatch/dist/lux/bootstrap.min.css';

const AllEmployeesAttendance = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [currentDate, setCurrentDate] = useState('');
    const [month, setMonth] = useState(new Date().getMonth() + 1); // Default to current month
    const [employeeSummary, setEmployeeSummary] = useState(null);

    // Fetch attendance data for all employees
    const fetchAttendanceData = async (month) => {
        try {
            const response = await axios.get(`/attendance/all/${month}`);
            setAttendanceData(response.data || []); // Ensure an empty array if data is null/undefined
        } catch (error) {
            console.error('Error fetching attendance data:', error);
            setAttendanceData([]); // Reset to empty array on error
        }
    };

    // Fetch attendance summary for a specific employee
    const fetchEmployeeSummary = async (employeeId) => {
        try {
            const response = await axios.get(`/attendance/${employeeId}/${month}`);
            setEmployeeSummary({ ...response.data, employeeId });
        } catch (error) {
            console.error('Error fetching employee summary:', error);
        }
    };

    // Fetch attendance data on mount
    useEffect(() => {
        const today = new Date();
        setCurrentDate(today.toDateString());
        fetchAttendanceData(month);
    }, [month]);

    return (
        <Container className="mt-4">
            {/* Header with Current Date */}
            <Row>
                <Col>
                    <h5 style={{ textAlign: 'left' }}>
                        <strong>Date:</strong> {currentDate}
                    </h5>
                </Col>
                <Col>
                    <Form.Control
                        type="number"
                        min="1"
                        max="12"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        placeholder="Enter month (1-12)"
                    />
                </Col>
            </Row>

            {/* Attendance Table */}
            <Row className="mt-4">
                <Col>
                    <h3>Attendance Summary for All Employees</h3>
                    <Table bordered hover responsive>
                        <thead className="thead-dark">
                            <tr>
                                <th>Employee ID</th>
                                <th>Present</th>
                                <th>Absent</th>
                                <th>On Leave</th>
                                <th>Holidays</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceData.length > 0 ? (
                                attendanceData.map((employee) => (
                                    <tr key={employee.employee_id}>
                                        <td>{employee.employee_id}</td>
                                        <td>{employee.present}</td>
                                        <td>{employee.absent}</td>
                                        <td>{employee.onleave}</td>
                                        <td>{employee.holidays}</td>
                                        <td>
                                            <Button
                                                variant="info"
                                                onClick={() => fetchEmployeeSummary(employee.employee_id)}
                                            >
                                                View Summary
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center' }}>
                                        No data available for this month.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Col>
            </Row>

            {/* Employee Summary */}
            {employeeSummary && (
                <Row className="mt-4">
                    <Col>
                        <h4>Attendance Summary for Employee ID: {employeeSummary.employeeId}</h4>
                        <ul>
                            <li>Present: {employeeSummary.present}</li>
                            <li>Absent: {employeeSummary.absent}</li>
                            <li>Holidays: {employeeSummary.holidays}</li>
                            <li>On Leave: {employeeSummary.onleave}</li>
                        </ul>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default AllEmployeesAttendance;
