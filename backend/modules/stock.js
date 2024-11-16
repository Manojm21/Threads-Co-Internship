const express = require('express');
const router = express.Router();
const Joi = require('joi');
const db = require('./db')

const itemSchema = Joi.object({
    id: Joi.number().integer().required(),
    name: Joi.string().max(100).required(),
    colour: Joi.string().max(100).required(),
    total_quantity: Joi.number().integer().required(),
    balance_quantity: Joi.number().integer().required(),
    Rack_no: Joi.string().max(50)
})


router.post('/', async (req, res) => {
    try {
        const { error, value } = itemSchema.validate(req.body);

        if (error) {
            return res.status(400).json({ msg: "Validation Error" });
        }

        const {
            id,
            name,
            colour,
            total_quantity,
            balance_quantity,
            Rack_no
        } = value;

        const [result] = await db.promise().query(`INSERT INTO Stock (id, name, colour, total_quantity, balance_quantity, Rack_no) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [id, name, colour, total_quantity, balance_quantity, Rack_no]);

        res.status(201).json("Successfully added item")
    }
    catch (error) {
        console.log("Error adding item:", error);
        res.status(500).json({ msg: "Internal Server Error" })
    }


});

//Getting all the items in the stock
router.get('/', async (req, res) => {
    try {
        const [result] = await db.promise().query('SELECT * FROM Stock');
        res.status(200).json(result[0]); //Returning only the json data of the array
    }
    catch (error) {
        console.log("Error while fetching items: ", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

//Deleting an item from the stock
router.delete('/:id', async (req, res) => {
    try {
        const itemID = req.params.id;

        //Validating the itemID to be an integer
        if (!/^\d+$/.test(itemID)) {
            return res.status(400).json({ msg: "Invalid item ID" });
        }

        const [result] = await db.promise().query(`DELETE FROM Stock WHERE id=?`, [itemID]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: "item not found in stock" });
        }

        res.status(200).json({ msg: `Successfully deleted the item with id: ${itemID}` });
    }
    catch (error) {
        console.log("Error deleting the item:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});
//to increase or decrease the stock value...
router.put('/:id/:flag/:qty', async (req, res) => {
    try {
        const [currb] = await db.promise().query('SELECT balance_quantity FROM Stock WHERE id=?', [req.params.id]);
        const [currt] = await db.promise().query('SELECT total_quantity FROM Stock WHERE id=?', [req.params.id]);
        query = 'UPDATE Stock SET balance_quantity=?,total_quantity=? WHERE id=?';
        if (req.params.flag=='1') {
            await db.promise().query(query, [parseInt(req.params.qty) + parseInt(currb[0]['balance_quantity']), parseInt(req.params.qty) + parseInt(currt[0]['total_quantity']), req.params.id]);
        }
        else {
            if (parseInt(currb[0]['balance_quantity']) - parseInt(req.params.qty) > 0)
                await db.promise().query(query, [parseInt(currb[0]['balance_quantity']) - parseInt(req.params.qty), parseInt(currt[0]['total_quantity']), req.params.id]);
            else
                res.status(400).json({ msg: "the inventory does not have the given nos units" });
        }
        res.status(200).json({msg:"Successfully upadated"})
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({msg:"error found while connecting to database"});
    }
});
module.exports = router;