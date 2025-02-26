const Inventory = require('../models/inventory');

// GET all inventory items
async function getInventory(req, res) {
    try {
        const inventory = await Inventory.getAll();
        res.status(200).json(inventory);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// GET single inventory item by ID
async function getInventoryById(req, res) {
    const { id } = req.params;
    try {
        const item = await Inventory.getById(id);
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// POST a new inventory item
async function createInventoryItem(req, res) {
    const { name, category, quantity, unit, price_per_unit, expiry_date } = req.body;
    try {
        const newItem = await Inventory.create(name, category, quantity, unit, price_per_unit, expiry_date);
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// PATCH - Update inventory (e.g., quantity update)
async function updateInventory(req, res) {
    const { id } = req.params;
    const { quantity } = req.body;
    try {
        const updatedItem = await Inventory.updateStock(id, quantity);
        if (!updatedItem) return res.status(404).json({ error: 'Item not found' });
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// DELETE an inventory item
async function deleteInventoryItem(req, res) {
    const { id } = req.params;
    try {
        const deletedItem = await Inventory.delete(id);
        if (!deletedItem) return res.status(404).json({ error: 'Item not found' });
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { getInventory, getInventoryById, createInventoryItem, updateInventory, deleteInventoryItem };
