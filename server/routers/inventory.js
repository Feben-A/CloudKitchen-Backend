const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventory");

router.get("/", inventoryController.index); // Get all inventory items or filter by restaurant_id
router.get("/:id", inventoryController.getInventoryById); // Get a single inventory item by ID

router.post("/", inventoryController.createOrUpdateInventory); // Add new stock or update existing

router.patch("/increase", inventoryController.increaseStock);
router.patch("/deduct", inventoryController.deductIngredientStock); // Deduct stock using FIFO
router.patch("/:id", inventoryController.updateInventoryItem);

router.delete("/expired-stock", inventoryController.removeExpiredStock); // Remove expired stock
router.delete("/:id", inventoryController.deleteInventoryItem); // Delete an inventory item

module.exports = router;