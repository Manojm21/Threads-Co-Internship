const express = require('express')
const router = express.Router()
const db = require('./db')
const joi = require('joi')

router.get('/:id/:month', async (req, res) => {
    const today = new Date();
    const curr_month = req.params.month;
    const valuesp = [req.params.id, 'Present', curr_month]
    const valuesa = [req.params.id, 'Absent', curr_month]
    const valueso = [req.params.id, 'On Leave', curr_month]
    const valuesh = [req.params.id, 'Holiday', curr_month]
    const query = 'SELECT COUNT(date) FROM Attendance WHERE employee_id=? AND STATUS =? AND MONTH(date)=?'
    const [pd] = await db.promise().query(query, valuesp);
    const [ad] = await db.promise().query(query, valuesa);
    const [od] = await db.promise().query(query, valueso);
    const [hd] = await db.promise().query(query, valuesh);
    const [salary] = await db.promise().query(`SELECT salary FROM Employees WHERE employee_id = ?`, [req.params.id]);
    console.log(salary[0]["salary"]);
    const sal = parseFloat(salary[0]["salary"]);
    pdn = parseInt(pd[0]["COUNT(date)"]);
    adn = parseInt(ad[0]["COUNT(date)"]);
    odn = parseInt(od[0]["COUNT(date)"]);
    hdn = parseInt(hd[0]["COUNT(date)"]);
    const daysInMonth = (year, month) => new Date(year, month, 0).getDate();
    console.log(parseInt(daysInMonth(today.getFullYear(), curr_month)))
    
    if (pdn + adn + odn + hdn != daysInMonth(today.getFullYear(), curr_month)) {
        res.status(400).json({
            msg: "Premature checking for salary"
        })
    }
    else {
        const netSalary = sal - (sal / (pdn + adn + odn)) * adn;
        res.status(201).json({ payableSalary: netSalary.toFixed(2) });
    }

})

module.exports = router;