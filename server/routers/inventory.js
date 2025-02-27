const express = require('express');
const router = express.Router();
const InventoryController = require('../controllers/inventory');

router.get("/expiring-soon", InventoryController.getExpiringSoonStock);
router.get('/', InventoryController.getInventory); 
router.get('/:id', InventoryController.getInventoryById); 
router.post('/', InventoryController.createInventoryItem); 
router.patch("/increase", InventoryController.increaseInventoryStock);
router.patch("/deduct", InventoryController.deductIngredientStock);
router.delete('/:id', InventoryController.deleteInventoryItem);


module.exports = router;
