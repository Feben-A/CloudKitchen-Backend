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
    console.log("new menu item");
    console.log(name, category, restaurant_id);
    const response = await db.query(
      "INSERT INTO Menu_items (name, category, restaurant_id) VALUES($1, $2, $3) RETURNING menu_item_id;",
      [name, category, restaurant_id]
    );
    console.log(response.rows[0].menu_item_id);

    if (response.rows.length !== 1) {
      throw new Error("Unable to add menu item");
    }

    return response.rows[0].menu_item_id;
  }

  static async newRecipe(ingredients, menu_item_id) {
    console.log(ingredients, menu_item_id);
    const results = [];
    console.log("new recipe");
    for (const ingredient of ingredients) {
      const response = await db.query(
        "INSERT INTO Recipes (menu_item_id, ingredient_name, quantity_required, unit) VALUES ($1, $2, $3, $4)",
        [
          menu_item_id,
          ingredient.ingredient_name,
          ingredient.quantity,
          ingredient.unit,
        ]
      );
      results.push(response.rows[0]);
    }

    return results;
  }
}
module.exports = Menu;
