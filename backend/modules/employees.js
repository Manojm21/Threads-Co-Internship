const express = require('express');
const router = express.Router();
const db = require('./db');
const Joi = require('joi');

//Creating an employee schema as an joi object for validating
const employeeSchema = Joi.object({
    employee_id: Joi.number().integer().min(1).optional(),  // Optional for new inserts if it's auto_increment
    name: Joi.string().max(100).required(),
    gender: Joi.string().valid('Male', 'Female', 'Other').required(), // Gender should belong to the enum
    phone_number: Joi.string().pattern(/^[0-9]{10}$/).required(),  // Max 15 digits for phone number
    role: Joi.string().max(100).required(),
    address: Joi.string().optional(),
    aadhar_number: Joi.string().pattern(/^[0-9]{12}$/).required(),  // Exactly 12 digits for Aadhar
    date_of_joining: Joi.date().iso().required(),
    salary: Joi.number().precision(2).positive().required()
});

//Route to get the names of all the employees in the db
router.get('/', async (req, res) => {
    try {
        const [employees] = await db.promise().query('SELECT * from Employees');
        res.json(employees);
    }
    catch (error) {
        console.log("Error occured while retrieving employees:", error);
        res.status(500).json({ 'msg': 'Internal Server Error' });
    }
});

//Route to add a new employee into the db after validating the request with the schema
router.post('/', async (req, res) => {

    try {
        const { error, value } = employeeSchema.validate(req.body);
        if (error) {
            res.status(400).json({ msg: error.details[0].message })
        }

        //Destructing the value variable 
        const {
            name,
            gender,
            phone_number,
            role,
            address,
            aadhar_number,
            date_of_joining,
            salary
        } = value;

        const [result] = await db.promise().query(
            `INSERT INTO Employees (name, gender, phone_number, role, address, aadhar_number, date_of_joining, salary) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, gender, phone_number, role, address, aadhar_number, date_of_joining, salary]
        );
        res.status(201).json({ msg: "Successfully added employee", empID: result.insertId })
    }
    catch (error) {
        console.log("Error adding an employee:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

//Delete the employee from the db based on the id
router.delete('/:id', async (req, res) => {
    try {
        const delID = req.params.id;

        //Checking the validity of the employee id passed through the url
        if(!delID){
            res.status(400).json({msg: "Invalid employee ID"});
        }
        const [result] = await db.promise().query(`DELETE FROM Employees WHERE employee_id = ?`,[delID]);

        //Checking if any row was actually deleted from the db
        if(result.affectedRows === 0){
            res.status(404).json({msg: "Employee not found"});
        }

        res.status(200).json({msg: "Successfully deleted employee", empID: delID})
    }
    catch (error) {
        console.log("Error deleting the employee: ", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }

});

module.exports = router;