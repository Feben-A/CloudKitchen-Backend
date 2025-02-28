const db = require("../db/connect");

class Order {
  constructor({ order_id, user_id, order_time, status, restuarant_id }) {
    (this.order_id = order_id),
      (this.user_id = user_id),
      (this.order_id = order_time);
    (this.status = status), (this.restuarant_id = restuarant_id);
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

  static async newOrder(user_id, restaurant_id) {
    const response = await db.query(
      "INSERT INTO Orders (user_id, restaurant_id) VALUES ($1, $2) RETURNING *;"
    );

    if (response.rows.length != 1) {
      throw new Error("Unable to add new order");
    }

    return response.rows[0];
  }

  static async newOrderMenuItems(items, order_id) {
    const results = [];
    for (const item of items) {
      const response = await db.query(
        "INSERT INTO Order_Menu_Items (order_id, menu_item_id, quantity) VALUES($1, $2, $3) RETURNING *;",
        [order_id, item.menu_item_id, item.quantity]
      );
      results.push(response);
    }
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
