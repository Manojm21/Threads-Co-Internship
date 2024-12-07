const express = require('express');
const router = express.Router();
const db = require('./db');

// Delete records older than 11 months
router.delete('/', async (req, res) => {
    try {
      const query = `
        DELETE FROM Attendance
        WHERE date < CURDATE() - INTERVAL 11 MONTH;
      `;
     
      await db.promise().query(query);  
      res.status(200).json({ message: 'Old attendance records deleted successfully' });
    } catch (error) {
      console.error('Error cleaning up old attendance records:', error);
      res.status(500).json({ message: 'Error cleaning up old attendance records' });
    }
});

module.exports = router;

