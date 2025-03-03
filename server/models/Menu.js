const db = require("../db/connect");

class Menu {
  static async getAll() {
    const response = await db.query("SELECT name, category FROM Menu_items;");
    if (response.rows.length == 0) {
      throw new Error("No menu items found");
    }
    return response.rows;
  }
  static async getMenuItems() {
    const response = await db.query("SELECT name FROM Menu_items;");
    if (response.rows.length == 0) {
      throw new Error("No menu items found");
    }

    console.log(response.rows[0]);

    return response.rows;
  }

  // menu item name, category, ingredients (object including the ingredient name, quantity and unit)
  // so we'll need to first get create order item retturnn the id to use and store info into the recipe's table.
}

module.exports = Menu;
