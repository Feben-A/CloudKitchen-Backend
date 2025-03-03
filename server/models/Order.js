const db = require("../db/connect");

class Order {

  static async getAll() {
    const response = await db.query(
      "SELECT o.order_id, o.order_time, STRING_AGG(CONCAT(m.quantity, ' ', m.menu_item), ', ') AS menu_items, SUM(m.quantity) AS total_quantity, o.order_notes, o.status FROM Orders AS o JOIN Order_menu_items AS m ON o.order_id = m.order_id GROUP BY o.order_id, o.order_time, o.order_notes, o.status ORDER BY o.order_id;"
    );

    if (response.rows.length === 0) {
      throw new Error("No orders found");
    }

    console.log(response.rows);
    return response.rows;
  }

  static async getOrderById(id) {
    const response = await db.query(
      "SELECT * FROM Orders WHERE order_id = $1;",
      [id]
    );

    if (response.rows.length != 1) {
      throw new Error("Unable to find order");
    }

    return new Order(response.rows[0]);
  }


  static async createOrder({ table_number, user_id, status, order_notes, restaurant_id }) {
    const query = `
        INSERT INTO Orders (table_number, user_id, status, order_notes, restaurant_id)
        VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    const values = [table_number, user_id, status, order_notes, restaurant_id];
    const { rows } = await db.query(query, values);
    return rows[0]; 
}

static async addOrderItems(items, order_id) {
  const results = [];
  
  for (const item of items) {
      const query = `
            INSERT INTO Order_Menu_Items (order_id, menu_item_id, menu_item, quantity)
            VALUES (
                $1, 
                (SELECT menu_item_id FROM Menu_Items WHERE name = $2), 
                $2, 
                $3
            ) 
            RETURNING *;
      `;
      const values = [order_id, item.foodItem, item.quantity];

      const { rows } = await db.query(query, values);
      results.push(rows[0]);
  }

  return results;
}


  static async newOrder(user_id, restaurant_id, table_number, order_notes) {
    if (order_notes.length === 0) {
      order_notes = "N/A";
    }
    const response = await db.query(
      "INSERT INTO Orders (user_id, restaurant_id, table_number, order_notes) VALUES ($1, $2, $3, $4) RETURNING *;",
      [user_id, restaurant_id, table_number, order_notes]
    );

    if (response.rows.length != 1) {
      throw new Error("Unable to add new order");
    }

    return response.rows[0];
  }

  static async newOrderMenuItems(items, order_id) {
    const results = [];

    for (const item of items) {
        const menuItemQuery = await db.query(
            "SELECT menu_item_id FROM Menu_Items WHERE name = $1;",
            [item.foodItem]
        );

        if (menuItemQuery.rows.length === 0) {
            throw new Error(`Menu item '${item.foodItem}' not found.`);
        }

        const menu_item_id = menuItemQuery.rows[0].menu_item_id;

        const response = await db.query(
            "INSERT INTO Order_Menu_Items (order_id, menu_item_id, menu_item, quantity) VALUES($1, $2, $3, $4) RETURNING *;",
            [order_id, menu_item_id, item.foodItem, item.quantity]
        );

        results.push(response.rows[0]);
    }

    console.log(results);
    return results;
}

  static async updateStatus(id) {
    const response = await db.query(
      "UPDATE Orders SET status = 'complete' WHERE order_id = $1 RETURNING status;",
      [id]
    );

    return response.rows[0];
  }

  static async deleteOrder(id) {
    const response = await db.query("DELETE FROM Orders WHERE order_id = $1;", [
      id,
    ]);
  }
}

module.exports = Order;
