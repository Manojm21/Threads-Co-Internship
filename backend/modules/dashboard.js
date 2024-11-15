const express = require('express')
const router = express.Router()
const db = require('./db')
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
catch(err){
    console.log(err);
    res.status(501).json({
        msg:"error in fetching data from the database"
    })
}       
})
// router.post('/attendance',async (req,res)=>
// {
//     const values = [req.attendance_id,req.employee-id,req.date,req.status]
//     const query = 'INSERT INTO ATTENDANCE(employee_id,date,status) VALUES(?,?,?,?)'
//     await db.query(query,values,(err,results)=>
//     {
//         if(err)
//             return callback(err);
//         else
//             callback(null,results);
//     })
// })
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