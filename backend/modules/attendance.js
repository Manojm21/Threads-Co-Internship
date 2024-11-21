const express = require('express')
const router = express.Router()
const db = require('./db')
const joi = require('joi')

//Schema for checking the request body of the attendance endpoint
const schema = joi.object({
    employee_id: joi.number().integer().required(),
    status: joi.string().valid('Present', 'Absent', 'Holiday', 'On Leave').required()
})


router.use(express.json());

router.get('/:id/:month', async (req, res) => {
    try {
        const curr_month = req.params.month;
        const valuesp = [req.params.id, 'Present', curr_month]
        const valuesa = [req.params.id, 'Absent', curr_month]
        const valuesh = [req.params.id, 'Holiday', curr_month]
        const valueso = [req.params.id, 'On Leave', curr_month]
        const query = 'SELECT COUNT(date) FROM Attendance WHERE employee_id=? AND STATUS =? AND MONTH(date)=?'
        const [pd] = await db.promise().query(query, valuesp);
        const [ad] = await db.promise().query(query, valuesa);
        const [hd] = await db.promise().query(query, valuesh);
        const [od] = await db.promise().query(query, valueso);
        res.status(201).json({
            present: pd[0]["COUNT(date)"],
            absent: ad[0]["COUNT(date)"],
            holidays: hd[0]["COUNT(date)"],
            onleave: od[0]["COUNT(date)"]
        });
    }
    catch (err) {
        console.log(err);
        res.status(501).json({
            msg: "error in fetching data from the database"
        })
    }
})

router.post('/', async (req, res) => {
    try {
        const { err } = schema.validate(req.body)
        if (err) {
            res.status(500).json(
                {
                    msg: "validation error"
                }
            );
        }
        const today = new Date();
        const year = String(today.getFullYear());
        const month = String(today.getMonth() + 1).padStart(2, '0'); // JavaScript months are 0-indexed
        const day = String(today.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;
        
        const values = [req.body.employee_id, formattedDate, req.body.status]
        const query = 'INSERT INTO Attendance(employee_id,date,status) VALUES(?,?,?)'
        await db.promise().query(query, values);
        res.status(201).json({
            msg: "successfully added attendance to the database"
        });
    }
    catch (err) {
        console.log(err);
        res.status(501).json({
            msg: "error in updation from the database"
        })
    }
});

module.exports = router;