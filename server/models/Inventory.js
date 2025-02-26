const db = require('../db/connect');

class Inventory {
    // Get all inventory items
    static async getAll() {
        const result = await db.query("SELECT * FROM Inventory");
        return result.rows;
    }

    // Get a single inventory item by ID
    static async getById(id) {
        const result = await db.query("SELECT * FROM Inventory WHERE ingredient_id = $1", [id]);
        return result.rows[0];
    }

    // Create a new inventory item
    static async create(name, category, quantity, unit, price_per_unit, expiry_date) {
        const result = await db.query(
            "INSERT INTO Inventory (name, category, quantity, unit, price_per_unit, expiry_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [name, category, quantity, unit, price_per_unit, expiry_date]
        );
        return result.rows[0];
    }

    // Update inventory quantity
    static async updateStock(id, quantity) {
        const result = await db.query(
            "UPDATE Inventory SET quantity = $1 WHERE ingredient_id = $2 RETURNING *",
            [quantity, id]
        );
        return result.rows[0];
    }

    // Delete an inventory item
    static async delete(id) {
        const result = await db.query("DELETE FROM Inventory WHERE ingredient_id = $1 RETURNING *", [id]);
        return result.rows[0];
    }
}

module.exports = Inventory;
