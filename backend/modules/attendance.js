const express = require('express');
const router = express.Router();
const db = require('./db'); // Updated to use connection pool
const joi = require('joi');

const schema = joi.object({
  employee_id: joi.number().integer().required(),
  status: joi.string().valid('Present', 'Absent', 'Holiday', 'On Leave').required(),
});

// Middleware to parse JSON
router.use(express.json());

// Fetch attendance for any selected date
router.get('/date/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const connection = await db.getConnection();

    try {
      const query = 'SELECT employee_id, status FROM Attendance WHERE date = ?';
      const [attendanceData] = await connection.query(query, [date]);

      res.status(200).json({ attendanceData });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching attendance data for selected date:', error);
    res.status(500).json({ message: 'Error fetching attendance data for selected date' });
  }
});

// Record or update attendance for today or any selected date
router.post('/', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // Default to today's date
    const attendanceData = req.body.attendance;

    const errors = [];
    const query = 'INSERT INTO Attendance (employee_id, date, status) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE status = ?';
    const connection = await db.getConnection();

    try {
      for (const record of attendanceData) {
        const { error } = schema.validate(record);
        if (error) {
          errors.push({ employee_id: record.employee_id, error: error.message });
          continue;
        }

        const status = record.status || 'Absent'; // Default status is "Absent"
        try {
          await connection.query(query, [record.employee_id, today, status, status]);
        } catch (err) {
          console.error('Error inserting/updating attendance:', err);
          throw err;
        }
      }

      if (errors.length > 0) {
        res.status(400).json({ message: 'Validation errors in some records', errors });
      } else {
        res.status(201).json({ message: 'Attendance recorded/updated successfully' });
      }
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error recording/updating attendance:', error);
    res.status(500).json({ message: 'Error recording/updating attendance' });
  }
});

// Edit attendance for any selected date
router.put('/date/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const attendanceData = req.body.attendance;

    const errors = [];
    const query = 'INSERT INTO Attendance (employee_id, date, status) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE status = ?';
    const connection = await db.getConnection();

    try {
      for (const record of attendanceData) {
        const { error } = schema.validate(record);
        if (error) {
          errors.push({ employee_id: record.employee_id, error: error.message });
          continue;
        }

        const status = record.status || 'Absent'; // Default status is "Absent"
        try {
          await connection.query(query, [record.employee_id, date, status, status]);
        } catch (err) {
          console.error('Error inserting/updating attendance:', err);
          throw err;
        }
      }

      if (errors.length > 0) {
        res.status(400).json({ message: 'Validation errors in some records', errors });
      } else {
        res.status(200).json({ message: 'Attendance updated successfully' });
      }
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating attendance for selected date:', error);
    res.status(500).json({ message: 'Error updating attendance for selected date' });
  }
});

// Fetch monthly attendance summary
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

    const connection = await db.getConnection();

    try {
      const [rows] = await connection.query(query, [month]);

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
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching attendance summary:', error);
    res.status(500).json({ message: 'Error fetching attendance summary' });
  }
});

module.exports = router;
