const Menu = require("../models/Menu");

// const create = async (res, req) => {
//   try {

//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

const show = async (req, res) => {
  try {
    const names = await Menu.getMenuItems();
    res.status(200).json(names);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

module.exports = { show };
