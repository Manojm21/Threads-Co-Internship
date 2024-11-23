const express = require('express');
const router = express.Router();
const db = require('./db');
const joi = require('joi');

// Schema for validating attendance data
const schema = joi.object({
  employee_id: joi.number().integer().required(),
  status: joi.string().valid('Present', 'Absent', 'Holiday', 'On Leave').required(),
});

// Middleware to parse JSON
router.use(express.json());

router.route('/')
  .get(async (req, res) => {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Fetch employee data
      const [employees] = await db.promise().query('SELECT employee_id, name FROM Employees');

      // Check if today's attendance is recorded
      const [attendance] = await db.promise().query(
        'SELECT COUNT(*) AS count FROM Attendance WHERE date = ?',
        [today]
      );

      const attendanceRecorded = attendance[0].count > 0;

      res.status(200).json({ employees, attendanceRecorded });
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      res.status(500).json({ message: 'Error fetching attendance data' });
    }
  })
  .post(async (req, res) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const attendanceData = req.body.attendance;

      const errors = [];
      const query = 'INSERT INTO Attendance (employee_id, date, status) VALUES (?, ?, ?)';

      for (const record of attendanceData) {
        const { error } = schema.validate(record);
        if (error) {
          errors.push({ employee_id: record.employee_id, error: error.message });
          continue;
        }

        try {
          await db.promise().query(query, [record.employee_id, today, record.status]);
        } catch (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res
              .status(400)
              .json({ message: 'Attendance already recorded for this employee today' });
          }
          throw err;
        }
      }

      if (errors.length > 0) {
        res.status(400).json({ message: 'Validation errors in some records', errors });
      } else {
        res.status(201).json({ message: 'Attendance recorded successfully' });
      }
    } catch (error) {
      console.error('Error recording attendance:', error);
      res.status(500).json({ message: 'Error recording attendance' });
    }
  });

router.get('/:month', async (req, res) => {
  try {
    const month = req.params.month;
    if (isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({ message: 'Invalid month parameter' });
    }

    const query = `
      SELECT employee_id, status, COUNT(*) AS count
      FROM Attendance
      WHERE MONTH(date) = ?
      GROUP BY employee_id, status`;

    const [rows] = await db.promise().query(query, [month]);

    const summary = {};
    rows.forEach((row) => {
      if (!summary[row.employee_id]) {
        summary[row.employee_id] = { present: 0, absent: 0, holidays: 0, onleave: 0 };
      }
      switch (row.status.toLowerCase()) {
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
  } catch (error) {
    console.error('Error fetching attendance summary:', error);
    res.status(500).json({ message: 'Error fetching attendance summary' });
  }
});

module.exports = router;
