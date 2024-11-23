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
    salary: Joi.number().precision(2).positive().required(),
    advance: Joi.number().precision(2).positive()
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
            salary,
            advance
        } = value;

        const [result] = await db.promise().query(
            `INSERT INTO Employees (name, gender, phone_number, role, address, aadhar_number, date_of_joining, salary, advance) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, gender, phone_number, role, address, aadhar_number, date_of_joining, salary, advance]
        );
        res.status(201).json({ msg: "Successfully added employee", empID: result.insertId })
    }
    catch (error) {
        console.log("Error adding an employee:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

// Route to update salary for an employee
router.put('/:id', async (req, res) => {
    try {
      const { error, value } = employeeSchema.validate(req.body);
  
      if (error) {
        return res.status(400).json({ msg: 'Validation error', details: error.details });
      }
  
      const { employee_id } = req.params;
      const { name, gender, phone_number, role, date_of_joining,salary,advance } = value;
  
      // Build the SQL query dynamically based on provided fields
      const updates = [];
      const params = [];
  
      if (name) {
        updates.push('name = ?');
        params.push(name);
      }
      if (gender) {
        updates.push('gender = ?');
        params.push(gender);
      }
      if (phone_number) {
        updates.push('phone_number = ?');
        params.push(phone_number);
      }
      if (role) {
        updates.push('role = ?');
        params.push(role);
      }
      if (date_of_joining) {
        updates.push('date_of_joining = ?');
        params.push(date_of_joining);
      }
      if (salary) {
        updates.push('salary = ?');
        params.push(salary);
      }
      if (advance) {
        updates.push('advance = ?');
        params.push(advance);
      }
  
      // If there are no fields to update, return an error
      if (updates.length === 0) {
        return res.status(400).json({ msg: 'No valid fields provided for update' });
      }
  
      // Add the id to the params array for the WHERE clause
      params.push(employee_id);
  
      const query = `UPDATE Employees SET ${updates.join(', ')} WHERE employee_id = ?`;
  
      const [result] = await db.promise().query(query, params);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ msg: 'Employee not found' });
      }
  
      res.status(200).json({ msg: 'Employee updated successfully' });
    } catch (err) {
      console.error('Error updating employee:', err);
      res.status(500).json({ msg: 'Internal server error' });
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