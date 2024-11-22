const express = require("express");
const router = express.Router();
const db = require("./db");
const joi = require("joi");

// Schema for validating attendance data
const schema = joi.object({
  employee_id: joi.number().integer().required(),
  status: joi.string().valid("Present", "Absent", "Holiday", "On Leave").required(),
});

// Middleware to parse JSON
router.use(express.json());

// Route to get all employees and submit attendance for employees
router.route("/")
  .get(async (req, res) => {
    try {
      const [rows] = await db.promise().query("SELECT employee_id, name FROM Employees");
      res.status(200).json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Error fetching employee data" });
    }
  })
  .post(async (req, res) => {
    try {
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0];

      const attendanceData = req.body.attendance;
      const errors = [];
      const query = "INSERT INTO Attendance(employee_id, date, status) VALUES (?, ?, ?)";

      for (const record of attendanceData) {
        // Validate each record using Joi
        const { error } = schema.validate(record);
        if (error) {
          errors.push({ employee_id: record.employee_id, error: error.message });
          continue;
        }

        // Insert the valid record into the database
        await db.promise().query(query, [record.employee_id, formattedDate, record.status]);
      }

      if (errors.length > 0) {
        res.status(400).json({ msg: "Some records have validation errors", errors });
      } else {
        res.status(201).json({ msg: "Attendance recorded successfully" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Error in updating the database" });
    }
  });

// Route to get attendance summary by month
router.get('/:month', async (req, res) => {
  try {
    const month = req.params.month;

    // Ensure `month` is a valid number
    if (isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({ msg: "Invalid month parameter" });
    }

    const query = `
      SELECT employee_id, STATUS, COUNT(date) AS count
      FROM Attendance
      WHERE MONTH(date) = ?
      GROUP BY employee_id, STATUS
    `;

    const [rows] = await db.promise().query(query, [month]);

    // Initialize an object to hold the attendance summary for all employees
    const summary = {};

    // Populate the summary with attendance data for each employee
    rows.forEach(row => {
      // Initialize the employee summary if it doesn't exist
      if (!summary[row.employee_id]) {
        summary[row.employee_id] = {
          present: 0,
          absent: 0,
          holidays: 0,
          onleave: 0
        };
      }

      // Update the attendance count for each status
      switch (row.STATUS.toLowerCase()) {
        case 'present':
          summary[row.employee_id].present = row.count;
          break;
        case 'absent':
          summary[row.employee_id].absent = row.count;
          break;
        case 'holiday':
          summary[row.employee_id].holidays = row.count;
          break;
        case 'on leave':
          summary[row.employee_id].onleave = row.count;
          break;
        default:
          break;
      }
    });

    res.status(200).json(summary);
  } catch (err) {
    console.error("Error fetching attendance summary:", err);
    res.status(500).json({ msg: "Error fetching attendance summary" });
  }
});

module.exports = router;
