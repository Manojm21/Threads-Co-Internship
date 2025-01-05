const express = require('express');
const router = express.Router();
const pool = require('./db'); // Use the pool instead of db
const joi = require('joi');

router.get('/:id/:month/:year', async (req, res) => {
    const today = new Date();
    const curr_month = req.params.month;
    const curr_year = req.params.year;
    const valuesp = [req.params.id, 'Present', curr_month];
    const valuesa = [req.params.id, 'Absent', curr_month];
    const valueshd = [req.params.id, 'Half Day', curr_month];
    const valuesh = [req.params.id, 'Holiday', curr_month];
    const query = 'SELECT COUNT(date) AS count FROM Attendance WHERE employee_id=? AND STATUS =? AND MONTH(date)=?';

    try {
        const connection = await pool.getConnection(); // Get a connection from the pool

        // Fetch attendance data
        const [pd] = await connection.query(query, valuesp);
        const [ad] = await connection.query(query, valuesa);
        const [hdd] = await connection.query(query, valueshd);
        const [hd] = await connection.query(query, valuesh);

        // Fetch salary details
        const [salary] = await connection.query(`SELECT salary FROM Employees WHERE employee_id = ?`, [req.params.id]);
        connection.release(); // Release the connection back to the pool

        if (!salary.length) {
            return res.status(404).json({ msg: 'Employee not found' });
        }

        const sal = parseFloat(salary[0].salary);
        const pdn = parseInt(pd[0].count, 10);
        const adn = parseInt(ad[0].count, 10);
        const hddn = parseInt(hdd[0].count, 10);
        const hdn = parseInt(hd[0].count, 10);

        // Calculate days in the current month
        const daysInMonth = (year, month) => new Date(year, month, 0).getDate();

        if (pdn + adn + hddn + hdn !== daysInMonth(curr_year, curr_month)) {
            return res.status(400).json({ msg: 'Premature checking for salary' });
        }

        const netSalary = sal - (sal / daysInMonth(curr_year, curr_month)) * adn - (sal / daysInMonth(curr_year, curr_month)) * 0.5 * hddn;
        res.status(201).json({ payableSalary: netSalary.toFixed(2) });

    } catch (error) {
        console.error('Error calculating salary:', error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
});

module.exports = router;
