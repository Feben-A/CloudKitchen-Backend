const db = require("../db/connect");

class Menu {
  static async getAll({ sortBy = "name", direction = "asc", search = "" }) {
    const validSortColumns = ["name", "category"];
    if (!validSortColumns.includes(sortBy)) {
        sortBy = "name";
    }
    if (direction !== "asc" && direction !== "desc") {
        direction = "asc";
    }

    const query = `
        SELECT m.menu_item_id AS id, m.name, m.category,
            COALESCE(
                json_agg(
                    json_build_object('ingredient_name', r.ingredient_name, 'quantity', r.quantity_required, 'unit', r.unit)
                ) FILTER (WHERE r.ingredient_name IS NOT NULL), '[]'
            ) AS ingredients
        FROM menu_items m
        LEFT JOIN recipes r ON m.menu_item_id = r.menu_item_id
        WHERE LOWER(m.name) LIKE LOWER($1) OR LOWER(m.category) LIKE LOWER($1)
        GROUP BY m.menu_item_id
        ORDER BY ${sortBy} ${direction};
    `;

    const values = [`%${search}%`];
    const response = await db.query(query, values);
    return response.rows.length ? response.rows : [];
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
