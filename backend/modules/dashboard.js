const express = require('express')
const router = express.Router()
const db = require('./db')
const joi = require('joi')
const schema = joi.object({
    employee_id: joi.number().integer().required(),
    status: joi.string().valid('Present','Absent','Holiday','On Leave').required()
})
router.use(express.json());
router.get('/attendance/:id/:month', async (req, res) => {
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
router.post('/attendance', async (req, res) => {
    try {
        const {err} = schema.validate(req.body)
        if(err)
        {
            res.status(500).json(
                {
                    msg:"validation error"
                }
            );
        }
        const today = new Date();
        const year = String(today.getFullYear());
        const month = String(today.getMonth() + 1).padStart(2, '0'); // JavaScript months are 0-indexed
        const day = String(today.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;
        const values = [req.body.employee_id, formattedDate, req.bodystatus]
        const query = 'INSERT INTO Attendance(employee_id,date,status) VALUES(?,?,?)'
        await db.promise().query(query, values);
        res.status(201).json({
            msg:"successfully added attendance to the database"
        });
    }
    catch (err) {
        console.log(err);
        res.status(501).json({
            msg: "error in updation from the database"
        })
    }
});
// // router.get('/salary',async (req,res)=>
// // {
// //     const valuesp = [req.employee_id,'Present']
// //     const valuesa = [req.employee_id,'Absent']
// //     const valuesh = [req.employee_id,'Holiday']
// //     const valueso = [req.employee_id,'On Leave']
// //     const query = 'SELECT COUNT(DATE) FROM ATTENDANCE GROUP BY employee_id  WHERE employee_id=? AND STATUS =?'
// //     const pd = await db.query(query,valuesp,(err,result)=>
// //     {
// //         if(err)
// //             return callback(err);
// //         else
// //             callback(null,result1);
// //     });
// //     const ad = await db.query(query,valuesa,(err,result)=>
// //         {
// //             if(err)
// //                 return callback(err);
// //             else
// //                 callback(null,result2);
// //         });
// //     const hd = await db.query(query,valuesh,(err,result)=>
// //         {
// //             if(err)
// //                 return callback(err);
// //             else
// //                 callback(null,result2);
// //         });
// //     const od = await db.query(query,valuesa,(err,result)=>
// //         {
// //             if(err)
// //                 return callback(err);
// //             else
// //                 callback(null,result);
// //         });
// //     const emps = db.query('SELECT SALARY FROM Employees WHERE employee_id=?',req.employee_id)
// //     const salary = 0;
// //     salary = emps
// // })
module.exports = router;