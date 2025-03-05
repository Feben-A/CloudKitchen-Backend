const Inventory = require("../models/Inventory");

class InventoryController {
    // GET all inventory items (filter by restaurant_id if provided)
    static async index(req, res) {
        try {
            const { restaurant_id, sortBy, direction } = req.query;
            
            const data = restaurant_id 
                ? await Inventory.getByRestaurantId(restaurant_id)
                : await Inventory.getAll(sortBy, direction);
    
            res.status(200).json(data);
        } catch (error) {
            console.error("Error fetching inventory:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // GET a specific inventory item by ID
    static async getInventoryById(req, res) {
        try {
            const { id } = req.params;
            const item = await Inventory.getById(id);

      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }

      res.status(200).json(item);
    } catch (error) {
      console.error("Error fetching inventory item:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

    // POST - Add new inventory item or update existing stock
    static async createOrUpdateInventory(req, res) {
        try {
            const { name, category, quantity, unit, price_per_unit, expiry_date, restaurant_id } = req.body;
    
            if (!name || !category || !quantity || !unit || !price_per_unit || !restaurant_id) {
                return res.status(400).json({ error: "Missing required fields" });
            }
    
            console.log("Received data:", { name, category, quantity, unit, price_per_unit, expiry_date, restaurant_id });
    
            const existingIngredient = await Inventory.getByNameAndRestaurant(name, restaurant_id);
    
            if (existingIngredient) {
                console.log("Ingredient exists. Updating stock...");
                const updatedItem = await Inventory.increaseStock(name, category, quantity, unit, price_per_unit, expiry_date, restaurant_id);
                return res.status(200).json(updatedItem);
            }
    
            console.log("Adding new ingredient...");
            const newItem = await Inventory.create(name, category, quantity, unit, price_per_unit, expiry_date, restaurant_id);
            res.status(201).json(newItem);
        } catch (error) {
            console.error("Error adding inventory item:", error);
            res.status(500).json({ error: "Internal Server Error", details: error.message });
        }
    }

    // PATCH - Increase stock
    static async increaseStock(req, res) {
        try {
            const { name, category, quantity, unit, price_per_unit, expiry_date, restaurant_id } = req.body;
            const updatedItem = await Inventory.increaseStock(name, category, quantity, unit, price_per_unit, expiry_date, restaurant_id);
            res.status(200).json(updatedItem);
        } catch (error) {
            console.error("Error increasing stock:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // PATCH - Deduct stock using FIFO
    static async deductIngredientStock(req, res) {
        try {
            const { name, quantity, restaurant_id } = req.body;
            const updatedStock = await Inventory.deductStockFIFO(name, quantity, restaurant_id);
            res.status(200).json(updatedStock);
        } catch (error) {
            console.error("Error deducting stock:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // PATCH - Update inventory item details
    static async updateInventoryItem(req, res) {
        try {
            const { id } = req.params;
            const updatedItem = await Inventory.update(id, req.body);

      if (!updatedItem) {
        return res.status(404).json({ error: "Item not found" });
      }

      res.status(200).json(updatedItem);
    } catch (error) {
      console.error("Error updating inventory item:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

    // DELETE - Remove expired stock
    static async removeExpiredStock(req, res) {
        try {
            const removedCount = await Inventory.deleteExpired();
            res.status(200).json({ message: `${removedCount} expired items removed` });
        } catch (error) {
            console.error("Error deleting expired stock:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // DELETE - Remove an inventory item by ID
    static async deleteInventoryItem(req, res) {
        try {
            const { id } = req.params;
            const deletedItem = await Inventory.deleteById(id);

      if (!deletedItem) {
        return res.status(404).json({ error: "Item not found" });
      }

      res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
      console.error("Error deleting inventory item:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = InventoryController;
