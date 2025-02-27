const Inventory = require("../models/inventory");

// Fetch all inventory items
async function getInventory(req, res) {
    try {
        const inventory = await Inventory.getAll();
        res.status(200).json(inventory);
    } catch (error) {
        console.error("Error fetching inventory:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// Fetch a single inventory item by ID
async function getInventoryById(req, res) {
    const { id } = req.params;
    try {
        const item = await Inventory.getById(id);
        if (!item) return res.status(404).json({ error: "Item not found" });
        res.status(200).json(item);
    } catch (error) {
        console.error("Error fetching inventory item:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// Fetch inventory items that are expiring soon
async function getExpiringSoonStock(req, res) {
    try {
        const days = req.query.days || 7;  // default to 7 days if not provided
        console.log(`Fetching inventory items expiring in the next ${days} days...`);
        const expiringStock = await Inventory.getExpiringSoon(days);
        res.status(200).json(expiringStock);
    } catch (error) {
        console.error("Error fetching expiring soon stock:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// Add a new inventory item (or update stock if ingredient already exists)
async function createInventoryItem(req, res) {
    const { name, category, quantity, unit, price_per_unit, expiry_date, restaurant_id } = req.body;
    try {
        // Check if an ingredient with the same name, expiry date, and restaurant exists
        const existingIngredient = await Inventory.getByNameAndRestaurant(name, restaurant_id, expiry_date);

        if (existingIngredient) {
            console.log("Ingredient already exists. Updating stock...");
            // If ingredient exists with the same expiry date, update its stock
            const updatedItem = await Inventory.increaseStock(name, category, quantity, unit, price_per_unit, expiry_date, restaurant_id);
            return res.status(200).json(updatedItem);
        }

        console.log("Adding new ingredient to inventory...");
        // Otherwise, create a new inventory entry
        const newItem = await Inventory.create(name, category, quantity, unit, price_per_unit, expiry_date, restaurant_id);
        res.status(201).json(newItem);
    } catch (error) {
        console.error("Error adding ingredient:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// Increase stock of an existing ingredient or create a new batch
async function increaseInventoryStock(req, res) {
    await createInventoryItem(req, res); // Calls the same logic as POST
}

// Deduct inventory stock using FIFO method (oldest batch first)
async function deductIngredientStock(req, res) {
    const { name, restaurant_id, quantity } = req.body;
    try {
        console.log(`Deducting ${quantity} of ${name} from restaurant ${restaurant_id}...`);
        const result = await Inventory.deductStock(name, restaurant_id, quantity);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error deducting stock:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// Delete an inventory item by ID
async function deleteInventoryItem(req, res) {
    const { id } = req.params;
    try {
        console.log(`Deleting inventory item with ID ${id}...`);
        const deletedItem = await Inventory.delete(id);
        if (!deletedItem) return res.status(404).json({ error: "Item not found" });
        res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        console.error("Error deleting inventory item:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = { getInventory, getInventoryById, getExpiringSoonStock, createInventoryItem, increaseInventoryStock, deductIngredientStock, deleteInventoryItem };