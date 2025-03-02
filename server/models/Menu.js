const db = require("../db/connect");

class Menu {
  static async getMenuItems() {
    const response = await db.query("SELECT name FROM Menu_items;");
    if (response.rows.length == 0) {
      throw new Error("No menu items found");
    }

    console.log(response.rows[0]);

    return response.rows;
  }
}

module.exports = Menu;
