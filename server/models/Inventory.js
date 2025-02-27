const db = require("../db/connect");

class Inventory {
  // Fetch all inventory items
  static async getAll() {
    const result = await db.query(
      "SELECT * FROM Inventory ORDER BY ingredient_id ASC"
    );
    return result.rows;
  }

  // Fetch a single inventory item by ID
  static async getById(id) {
    const result = await db.query(
      "SELECT * FROM Inventory WHERE ingredient_id = $1",
      [id]
    );
    return result.rows[0];
  }

  // Check if an ingredient exists in a restaurant with the same expiry date
  static async getByNameAndRestaurant(name, restaurant_id, expiry_date) {
    const result = await db.query(
      "SELECT * FROM Inventory WHERE name = $1 AND restaurant_id = $2 AND expiry_date = $3",
      [name, restaurant_id, expiry_date]
    );
    return result.rows[0];
  }

  // Create a new inventory item
  static async create(
    name,
    category,
    quantity,
    unit,
    price_per_unit,
    expiry_date,
    restaurant_id
  ) {
    const result = await db.query(
      "INSERT INTO Inventory (name, category, quantity, unit, price_per_unit, expiry_date, restaurant_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        name,
        category,
        quantity,
        unit,
        price_per_unit,
        expiry_date,
        restaurant_id,
      ]
    );
    return result.rows[0];
  }

  // Increase inventory stock (either update existing batch or create a new one)
  static async increaseStock(
    name,
    category,
    quantity,
    unit,
    price_per_unit,
    expiry_date,
    restaurant_id
  ) {
    const existingIngredient = await db.query(
      "SELECT * FROM Inventory WHERE name = $1 AND expiry_date = $2 AND restaurant_id = $3",
      [name, expiry_date, restaurant_id]
    );

    if (existingIngredient.rows.length > 0) {
      // Update stock if batch exists
      const result = await db.query(
        "UPDATE Inventory SET quantity = quantity + $1 WHERE ingredient_id = $2 RETURNING *",
        [quantity, existingIngredient.rows[0].ingredient_id]
      );
      return result.rows[0];
    } else {
      // Create new batch if expiry date differs
      return await this.create(
        name,
        category,
        quantity,
        unit,
        price_per_unit,
        expiry_date,
        restaurant_id
      );
    }
  }

  // Deduct stock using FIFO method (oldest batch first)
  static async deductStock(name, restaurant_id, quantityToDeduct) {
    let remainingQuantity = quantityToDeduct;

    // Fetch the oldest batch first
    const batches = await db.query(
      "SELECT ingredient_id, quantity FROM Inventory WHERE name = $1 AND restaurant_id = $2 ORDER BY expiry_date ASC",
      [name, restaurant_id]
    );

    for (let batch of batches.rows) {
      if (remainingQuantity <= 0) break;

      let deductAmount = Math.min(batch.quantity, remainingQuantity);
      remainingQuantity -= deductAmount;

      if (batch.quantity - deductAmount <= 0) {
        await db.query("DELETE FROM Inventory WHERE ingredient_id = $1", [
          batch.ingredient_id,
        ]);
      } else {
        await db.query(
          "UPDATE Inventory SET quantity = quantity - $1 WHERE ingredient_id = $2",
          [deductAmount, batch.ingredient_id]
        );
      }
    }

    return { message: "Stock deducted successfully" };
  }

  // Delete an inventory item
  static async delete(id) {
    const result = await db.query(
      "DELETE FROM Inventory WHERE ingredient_id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }

  // Get inventory items that are expiring soon (e.g., within the next 7 days)
  static async getExpiringSoon(days = 7) {
    const result = await db.query(`
            SELECT * FROM Inventory 
            WHERE expiry_date BETWEEN NOW() AND NOW() + INTERVAL '${days} days'
            ORDER BY expiry_date ASC;
        `);
    return result.rows;
  }

  // Analytics Queries

  // Get total ingredient usage per month
  static async getIngredientUsage() {
    const result = await db.query(`
            SELECT name, DATE_TRUNC('month', order_time) AS month, SUM(quantity_used) AS total_used
            FROM Order_Ingredients 
            JOIN Inventory ON Order_Ingredients.ingredient_id = Inventory.ingredient_id
            JOIN Orders ON Order_Ingredients.order_id = Orders.order_id
            GROUP BY name, month
            ORDER BY month ASC;
        `);
    return result.rows;
  }

  // Get expired vs used stock ratio
  static async getWasteAnalysis() {
    const result = await db.query(`
            SELECT 
                (SELECT SUM(quantity) FROM Inventory WHERE expiry_date < NOW()) AS total_wasted,
                (SELECT SUM(quantity_used) FROM Order_Ingredients) AS total_used;
        `);
    return result.rows[0];
  }

  // Get cost analysis per month
  static async getCostAnalysis() {
    const result = await db.query(`
            SELECT DATE_TRUNC('month', order_time) AS month, SUM(quantity_used * price_per_unit) AS total_cost
            FROM Order_Ingredients 
            JOIN Inventory ON Order_Ingredients.ingredient_id = Inventory.ingredient_id
            JOIN Orders ON Order_Ingredients.order_id = Orders.order_id
            GROUP BY month
            ORDER BY month ASC;
        `);
    return result.rows;
  }
}

module.exports = Inventory;
