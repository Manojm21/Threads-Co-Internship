const express = require('express');
const router = express.Router();
const db = require('./db'); 
const joi = require('joi');

const getTodayDate = () => new Date().toISOString().split('T')[0];

// Joi Schema for validating attendance input
const schema = joi.object({
  employee_id: joi.number().integer().required(),
  status: joi.string().valid('Present', 'Absent', 'Holiday').required(), 
  date: joi.date().optional(),
});

// Middleware to parse JSON
router.use(express.json());

// Get attendance for a specific date or today if no date is provided
router.route('/')
  .get(async (req, res) => {
    try {
      const { date } = req.query; // Retrieve date from query parameter
      const today = date || getTodayDate(); // Default to today if no date is provided

      const connection = await db.getConnection();

      try {
        // Fetch employee list
        const [employees] = await connection.query('SELECT employee_id, name FROM Employees');

        // Check attendance for the specific date
        const [attendance] = await connection.query(
          'SELECT employee_id, status FROM Attendance WHERE date = ?',
          [today]
        );

        const attendanceData = attendance.reduce((acc, record) => {
          acc[record.employee_id] = record.status;
          return acc;
        }, {});

        res.status(200).json({ employees, attendanceData });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      res.status(500).json({ message: 'Error fetching attendance data' });
    }
  })
  .post(async (req, res) => {
    try {
      const { attendance } = req.body;
      const errors = [];
      const query = 'INSERT INTO Attendance (employee_id, date, status) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE status = VALUES(status)';
      const connection = await db.getConnection();

      try {
        for (const record of attendance) {
          const date = record.date || getTodayDate(); // Use provided date or default to today
          const { error } = schema.validate({ ...record, date });
          if (error) {
            errors.push({ employee_id: record.employee_id, error: error.message });
            continue;
          }

          try {
            // Use 'ON DUPLICATE KEY UPDATE' to handle both insert and update
            await connection.query(query, [record.employee_id, date, record.status]);
          } catch (err) {
            console.error('Database error:', err);
            throw err;
          }
        }

        if (errors.length > 0) {
          res.status(400).json({ message: 'Validation errors in some records', errors });
        } else {
          res.status(201).json({ message: 'Attendance recorded successfully' });
        }
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Error recording attendance:', error);
      res.status(500).json({ message: 'Error recording attendance' });
    }
  });

// Update attendance for a specific employee and date
router.patch('/:employee_id/:date', async (req, res) => {
  try {
    const { employee_id, date } = req.params;
    const { status } = req.body;

    const { error } = joi.object({
      employee_id: joi.number().integer().required(),
      status: joi.string().valid('Present', 'Absent', 'Holiday').required(),
      date: joi.date().iso().required(),
    }).validate({ employee_id, status, date });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const query = `UPDATE Attendance SET status = ? WHERE employee_id = ? AND date = ?`;

    const connection = await db.getConnection();

    try {
      const [result] = await connection.query(query, [status, employee_id, date]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          message: `Attendance record not found for employee ${employee_id} on ${date}` 
        });
      }

      res.status(200).json({ message: 'Attendance updated successfully' });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ message: 'Error updating attendance' });
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
         
          default:
            break;
        }
      });

      res.status(200).json(summary);
    } finally {
      connection.release(); // Always release the connection
    }
  } catch (error) {
    console.error('Error fetching attendance summary:', error);
    res.status(500).json({ message: 'Error fetching attendance summary' });
  }
});

module.exports = router;
