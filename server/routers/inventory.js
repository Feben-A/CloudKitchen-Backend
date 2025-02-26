const express = require('express');
const router = express.Router();
const InventoryController = require('../controllers/inventory');

// GET all inventory items
router.get('/', InventoryController.getInventory);

// GET a single inventory item by ID
router.get('/:id', InventoryController.getInventoryById);

// POST a new inventory item
router.post('/', InventoryController.createInventoryItem);

// PATCH - Update inventory fields
router.patch('/:id', InventoryController.updateInventory);

// DELETE an inventory item
router.delete('/:id', InventoryController.deleteInventoryItem);

module.exports = router;
