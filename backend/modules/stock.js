const express = require('express');
const router = express.Router();
const Joi = require('joi');
const db = require('./db')

// Schema validation for the Stock item
const itemSchema = Joi.object({
    id: Joi.number().integer().required(),
    name: Joi.string().max(100).required(),
    colour: Joi.string().max(100).required(),
    total_quantity: Joi.number().integer().required(),
    balance_quantity: Joi.number().integer().required(),
    Rack_no: Joi.string().max(50),
    Size: Joi.string().max(10),
    bulk_retail: Joi.string().valid('bulk', 'retail').required() // New field added
});

// Route to add new item to stock
router.post('/', async (req, res) => {
    try {
        console.log("Received body:", req.body);
        
        // Validate the incoming data
        const { error, value } = itemSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ msg: "Validation Error" });
        }

        const { id, name, colour, total_quantity, balance_quantity, Rack_no, Size, bulk_retail } = value;

        // Insert the validated data into the database
        const [result] = await db.promise().query(`
            INSERT INTO Stock (id, name, colour, total_quantity, balance_quantity, Rack_no, Size, bulk_retail) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
            [id, name, colour, total_quantity, balance_quantity, Rack_no, Size, bulk_retail]
        );

        res.status(201).json("Successfully added item");

    } catch (error) {
        console.log("Error adding item:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

// Route to get all items in stock
router.get('/', async (req, res) => {
    try {
        const [result] = await db.promise().query('SELECT * FROM Stock');
        res.status(200).json(result);
    } catch (error) {
        console.log("Error while fetching items: ", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

// Route to delete an item from stock
router.delete('/:id', async (req, res) => {
    try {
        const itemID = req.params.id;
        if (!/^\d+$/.test(itemID)) {
            return res.status(400).json({ msg: "Invalid item ID" });
        }

        const [result] = await db.promise().query(`DELETE FROM Stock WHERE id=?`, [itemID]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: "Item not found in stock" });
        }

        res.status(200).json({ msg: `Successfully deleted the item with id: ${itemID}` });
    } catch (error) {
        console.log("Error deleting the item:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

// Route to update an item in stock
router.put('/:id', async (req, res) => {
    try {
        const { error, value } = itemSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ msg: 'Validation error', details: error.details });
        }

        const { id } = req.params;
        const { name, colour, total_quantity, balance_quantity, Rack_no, bulk_retail } = value;

        // Build the SQL query dynamically based on provided fields
        const updates = [];
        const params = [];

        if (name) {
            updates.push('name = ?');
            params.push(name);
        }
        if (colour) {
            updates.push('colour = ?');
            params.push(colour);
        }
        if (total_quantity) {
            updates.push('total_quantity = ?');
            params.push(total_quantity);
        }
        if (balance_quantity) {
            updates.push('balance_quantity = ?');
            params.push(balance_quantity);
        }
        if (Rack_no) {
            updates.push('Rack_no = ?');
            params.push(Rack_no);
        }
        if (bulk_retail) {
            updates.push('bulk_retail = ?');
            params.push(bulk_retail);
        }

        if (updates.length === 0) {
            return res.status(400).json({ msg: 'No valid fields provided for update' });
        }

        params.push(id); // Add the item ID for the WHERE clause

        const query = `UPDATE Stock SET ${updates.join(', ')} WHERE id = ?`;
        const [result] = await db.promise().query(query, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Stock item not found' });
        }

        res.status(200).json({ msg: 'Stock item updated successfully' });

    } catch (err) {
        console.error('Error updating stock item:', err);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

module.exports = router;
