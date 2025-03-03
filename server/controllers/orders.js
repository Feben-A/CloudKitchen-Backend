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

const createOrder = async(req, res) => {
  try {
      const { table_number, user_id, status, order_notes, restaurant_id, items } = req.body;

      if (!table_number || !user_id || !restaurant_id || !items || items.length === 0) {
          return res.status(400).json({ error: "Missing required fields or empty order items." });
      }

      const newOrder = await Order.createOrder({
          table_number,
          user_id,
          status: status || "preparing", // Default to "preparing"
          order_notes: order_notes || "N/A",
          restaurant_id
      });

      const orderItems = await Order.addOrderItems(items, newOrder.order_id);

      res.status(201).json({
          message: "Order created successfully!",
          order: newOrder,
          items: orderItems
      });

  } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Server error while creating the order." });
  }
}

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
  createOrder,
  update,
  remove,
};
