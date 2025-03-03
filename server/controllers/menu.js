const { getInventoryId } = require("../models/Inventory");
const Menu = require("../models/Menu");

const index = async (req, res) => {
  try {
    const response = await Menu.getAll();
    res.status(200).json(response);
  } catch (err) {
    res.status(200).json({ error: err.message });
  }
};

const show = async (req, res) => {
  try {
    const names = await Menu.getMenuItems();
    res.status(200).json(names);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const ingredients = req.body.ingredients; //should be an array of objects

    const menuItemId = await Menu.newItem(
      req.body.name,
      req.body.category,
      req.restaurant_id
    );

    const updatedIngredients = await Promise.all(
      ingredients.map(async (ingredient) => {
        const ingredientId = await Inventory.getInventoryId(ingredient.name);
        return { ...ingredient, id: ingredientId };
      })
    );
    const response = await Menu.newRecipe(updatedIngredients, menuItemId);
    res.status(200).json(response);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

module.exports = { index, show };
