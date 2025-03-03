const db = require("../db/connect");

class Inventory {
    // GET all inventory items
    static async getAll() {
        const response = await db.query("SELECT * FROM Inventory ORDER BY name ASC;");
        return response.rows;
    }

    // GET an inventory item by ID
    static async getById(id) {
        const response = await db.query("SELECT * FROM Inventory WHERE ingredient_id = $1;", [id]);
        return response.rows[0] || null;
    }

    // GET inventory items by restaurant ID
    static async getByRestaurantId(restaurant_id) {
        const response = await db.query("SELECT * FROM Inventory WHERE restaurant_id = $1;", [restaurant_id]);
        return response.rows;
    }

    

    // ✅ Check if an item exists by name and restaurant
    static async getByNameAndRestaurant(name, restaurant_id) {
        const response = await db.query(
            "SELECT * FROM Inventory WHERE name = $1 AND restaurant_id = $2;",
            [name, restaurant_id]
        );
        return response.rows[0] || null;
    }

    // ✅ CREATE new inventory item
    static async create(name, category, quantity, unit, price_per_unit, expiry_date, restaurant_id) {
        try {
            console.log("📝 Inserting new inventory item:", name, category, quantity, unit, price_per_unit, expiry_date, restaurant_id);
    
            const response = await db.query(
                `INSERT INTO Inventory (name, category, quantity, unit, price_per_unit, expiry_date, restaurant_id)
                 VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
                [name, category, quantity, unit, price_per_unit, expiry_date || null, restaurant_id]
            );
    
            console.log("✅ Successfully added item:", response.rows[0]);
            return response.rows[0];
        } catch (error) {
            console.error("❌ Error inserting inventory:", error);
            throw new Error("Database Insert Error: " + error.message);
        }
    }

    // ✅ UPDATE inventory item by ID
    static async update(id, { name, category, quantity, unit, price_per_unit, expiry_date, restaurant_id }) {
        const response = await db.query(
            `UPDATE Inventory 
             SET name = $1, category = $2, quantity = $3, unit = $4, price_per_unit = $5, expiry_date = $6, restaurant_id = $7
             WHERE ingredient_id = $8 RETURNING *;`,
            [name, category, quantity, unit, price_per_unit, expiry_date || null, restaurant_id, id]
        );
        return response.rows[0] || null;
    }

    // ✅ INCREASE stock for an existing inventory item
    static async increaseStock(name, category, quantity, unit, price_per_unit, expiry_date, restaurant_id) {
        const response = await db.query(
            `UPDATE Inventory 
             SET quantity = quantity + $1 
             WHERE name = $2 AND category = $3 AND restaurant_id = $4 
             RETURNING *;`,
            [quantity, name, category, restaurant_id]
        );
        return response.rows[0] || null;
    }

    // ✅ FIFO STOCK DEDUCTION - Deduct stock in FIFO order
    static async deductStockFIFO(name, quantity, restaurant_id) {
        const client = await db.connect();
        try {
            await client.query("BEGIN");

            // Get oldest available stock for the ingredient
            const stockRows = await client.query(
                `SELECT ingredient_id, quantity 
                 FROM Inventory 
                 WHERE name = $1 AND restaurant_id = $2 
                 ORDER BY expiry_date ASC NULLS LAST;`,
                [name, restaurant_id]
            );

            let remainingQuantity = quantity;
            for (const row of stockRows.rows) {
                if (remainingQuantity <= 0) break;

                let deductedAmount = Math.min(remainingQuantity, row.quantity);
                remainingQuantity -= deductedAmount;

                await client.query(
                    `UPDATE Inventory 
                     SET quantity = quantity - $1 
                     WHERE ingredient_id = $2;`,
                    [deductedAmount, row.ingredient_id]
                );

                // Remove items with zero quantity
                await client.query(`DELETE FROM Inventory WHERE quantity <= 0;`);
            }

            await client.query("COMMIT");
            return { message: `Successfully deducted ${quantity} units of ${name}` };
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    // ✅ DELETE an inventory item by ID
    static async deleteById(id) {
        const response = await db.query(
            "DELETE FROM Inventory WHERE ingredient_id = $1 RETURNING *;",
            [id]
        );
        return response.rowCount > 0;
    }

    // ✅ DELETE expired stock
    static async deleteExpired() {
        const response = await db.query(
            "DELETE FROM Inventory WHERE expiry_date < CURRENT_DATE RETURNING *;"
        );
        return response.rowCount;
    }
}

module.exports = Inventory;