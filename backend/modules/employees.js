const express = require('express');
const router = express.Router();
const db = require('./db'); // Using connection pool
const Joi = require('joi');

// Creating an employee schema as a Joi object for validating
const employeeSchema = Joi.object({
    employee_id: Joi.number().integer().min(1).optional(),
    name: Joi.string().max(100).required(),
    gender: Joi.string().valid('Male', 'Female', 'Other').required(),
    phone_number: Joi.string().pattern(/^[0-9]{10}$/).required(),
    role: Joi.string().max(100).required(),
    address: Joi.string().optional(),
    aadhar_number: Joi.string().pattern(/^[0-9]{12}$/).required(),
    date_of_joining: Joi.date().iso().required(),
    salary: Joi.number().precision(2).positive().required(),
    advance: Joi.number().precision(2),
    notes: Joi.string().optional(),
});

// Route to get the names of all the employees in the database
router.get('/', async (req, res) => {
    try {
        const connection = await db.getConnection();

        try {
            const [employees] = await connection.query('SELECT * FROM Employees');
            res.json(employees);
        } finally {
            connection.release(); // Release connection
        }
    } catch (error) {
        console.error("Error occurred while retrieving employees:", error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
});

// Route to add a new employee into the database
router.post('/', async (req, res) => {
    try {
        const { error, value } = employeeSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ msg: error.details[0].message });
        }

        const {
            name, gender, phone_number, role, address, aadhar_number,
            date_of_joining, salary, advance, notes
        } = value;

        const connection = await db.getConnection();

        try {
            const [result] = await connection.query(
                `INSERT INTO Employees (name, gender, phone_number, role, address, aadhar_number, date_of_joining, salary, advance, notes) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [name, gender, phone_number, role, address, aadhar_number, date_of_joining, salary, advance, notes]
            );
            res.status(201).json({ msg: "Successfully added employee", empID: result.insertId });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("Error adding an employee:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

// Route to update an employee's information
router.put('/:id', async (req, res) => {
    try {
        const { error, value } = employeeSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ msg: 'Validation error', details: error.details });
        }

        const employee_id = req.params.id;
        const { name, gender, phone_number, role, date_of_joining, salary, advance, notes } = value;

        const updates = [];
        const params = [];

        if (name) updates.push('name = ?'), params.push(name);
        if (gender) updates.push('gender = ?'), params.push(gender);
        if (phone_number) updates.push('phone_number = ?'), params.push(phone_number);
        if (role) updates.push('role = ?'), params.push(role);
        if (date_of_joining) updates.push('date_of_joining = ?'), params.push(date_of_joining);
        if (salary !== undefined) updates.push('salary = ?'), params.push(salary);
        if (advance !== undefined) updates.push('advance = ?'), params.push(advance);
        if (notes !== undefined) updates.push('notes = ?'), params.push(notes);

        if (updates.length === 0) {
            return res.status(400).json({ msg: 'No valid fields provided for update' });
        }

        params.push(employee_id);

        const query = `UPDATE Employees SET ${updates.join(', ')} WHERE employee_id = ?`;

        const connection = await db.getConnection();

        try {
            const [result] = await connection.query(query, params);

            if (result.affectedRows === 0) {
                return res.status(404).json({ msg: 'Employee not found' });
            }

            res.status(200).json({ msg: 'Employee updated successfully' });
        } finally {
            connection.release();
        }
    } catch (err) {
        console.error('Error updating employee:', err);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
});

// Route to delete an employee by ID
router.delete('/:id', async (req, res) => {
    try {
        const delID = req.params.id;

        if (!delID) {
            return res.status(400).json({ msg: "Invalid employee ID" });
        }

        const connection = await db.getConnection();

        try {
            const [result] = await connection.query(`DELETE FROM Employees WHERE employee_id = ?`, [delID]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ msg: "Employee not found" });
            }

            res.status(200).json({ msg: "Successfully deleted employee", empID: delID });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("Error deleting the employee:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

module.exports = router;
