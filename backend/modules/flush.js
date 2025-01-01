const express = require('express');
const router = express.Router();
const db = require('./db'); // Using the connection pool

// Delete records older than 11 months
router.delete('/', async (req, res) => {
    try {
        const query = `
            DELETE FROM Attendance
            WHERE date < CURDATE() - INTERVAL 11 MONTH;
        `;

        const connection = await db.getConnection(); // Get a pooled connection

        try {
            await connection.query(query); // Execute the query
            res.status(200).json({ message: 'Old attendance records deleted successfully' });
        } finally {
            connection.release(); // Release the connection back to the pool
        }
    } catch (error) {
        console.error('Error cleaning up old attendance records:', error);
        res.status(500).json({ message: 'Error cleaning up old attendance records' });
    }
});

module.exports = router;
