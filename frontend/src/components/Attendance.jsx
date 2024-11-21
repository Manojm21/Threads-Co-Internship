import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import "./Attendance.css"; // Add custom styling if needed
import { Container, Row, Col, Button, ToggleButton, ButtonGroup } from "react-bootstrap";

const AttendanceApp = () => {
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentStatus, setCurrentStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const employeeId = 1; // Example employee ID, you can dynamically set this
  const currentMonth = selectedDate.getMonth() + 1; // JavaScript months are 0-indexed

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/attendance/${employeeId}/${currentMonth}`
      );
      setAttendanceData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching attendance data", error);
      setLoading(false);
    }
  };

  const handleStatusChange = (status) => {
    setCurrentStatus(status);
  };

  const submitAttendance = async () => {
    try {
      const today = new Date();
      const formattedDate = `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

      await axios.post("/attendance", {
        employee_id: employeeId,
        status: currentStatus,
      });

      alert("Attendance marked successfully!");
      fetchAttendance();
    } catch (error) {
      console.error("Error submitting attendance", error);
      alert("Failed to submit attendance.");
    }
  };

  const tileClassName = ({ date }) => {
    if (!attendanceData || loading) return "";
    const formattedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    if (formattedDate in attendanceData) {
      switch (attendanceData[formattedDate]) {
        case "Present":
          return "present-day";
        case "Absent":
          return "absent-day";
        case "On Leave":
          return "on-leave-day";
        default:
          return "";
      }
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={8}>
          <h2 className="text-center">Attendance Calendar</h2>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileClassName={tileClassName}
          />
        </Col>
        <Col md={4}>
          <h2 className="text-center">Mark Today's Attendance</h2>
          <ButtonGroup className="d-flex justify-content-center mt-3">
            <ToggleButton
              type="radio"
              variant="outline-success"
              name="status"
              value="Present"
              checked={currentStatus === "Present"}
              onChange={() => handleStatusChange("Present")}
            >
              Present
            </ToggleButton>
            <ToggleButton
              type="radio"
              variant="outline-danger"
              name="status"
              value="Absent"
              checked={currentStatus === "Absent"}
              onChange={() => handleStatusChange("Absent")}
            >
              Absent
            </ToggleButton>
            <ToggleButton
              type="radio"
              variant="outline-primary"
              name="status"
              value="On Leave"
              checked={currentStatus === "On Leave"}
              onChange={() => handleStatusChange("On Leave")}
            >
              On Leave
            </ToggleButton>
          </ButtonGroup>
          <Button
            className="mt-3 w-100"
            variant="primary"
            disabled={!currentStatus}
            onClick={submitAttendance}
          >
            Submit
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default AttendanceApp;
