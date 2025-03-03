const db = require("../db/connect");
const Order = require("../models/Order");

const index = async (req, res) => {
  try {
    const response = await Order.getAll();
    console.log(response);
    res.status(200).json(response);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};


const create = async (req, res) => {
  try {
    console.log(req.body);
    const items = req.body.items;
    console.log(items);
    const newOrder = await Order.newOrder(
      req.user_id,
      req.restaurant_id,
      req.body.table_number,
      req.body.order_notes
    );
    const response = await Order.newOrderMenuItems(items, newOrder.order_id);
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const status = await Order.updateStatus(req.params.id);
    res.status(200).json(status);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const removeOrder = await Order.deleteOrder(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  index,
  create,
  update,
  remove,
};
