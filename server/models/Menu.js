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

    console.log(response.rows);

    return response.rows;
  }

  static async newItem(name, category, restaurant_id) {
    const response = db.query(
      "INSERT INTO Menu_items (name, category, restaurant_id) VALUES( $1, $2, $3) RETURNING menu_item_id;"[
        (name, category, restaurant_id)
      ]
    );

    if (response.rows.length != 1) {
      throw new Error("Unable to add menu item");
    }

    return response.rows[0];
  }

  static async newRecipe(ingredients, menu_item_id) {
    const results = [];
    for (const ingredient of ingredients) {
      const response = await db.query(
        "INSERT INTO Recipe (menu_item_id, ingredient_name, ingredient_id, quantity_required, unit"[
          (menu_item_id,
          ingredient.name,
          ingredient.id,
          ingredient.quantity,
          ingredient.unit)
        ]
      );
      results.push(response.rows[0]);
    }

    return results;
  }
}
module.exports = Menu;
