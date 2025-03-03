const express = require("express");
const cors = require("cors");

const logger = require("./middlewares/logger");

const userRouter = require("./routers/users");
const inventoryRouter = require("./routers/inventory");
const analyticsRouter = require("./routers/analytics");
const orderRouter = require("./routers/orders");
const menuRouter = require("./routers/menu");

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.get("/", (req, res) => {
  res.status(200).json({ description: "Cloud Kitchen API is running" });
});

app.use("/users", userRouter);
app.use("/inventory", inventoryRouter);
app.use("/analytics", analyticsRouter);
app.use("/orders", orderRouter);
app.use("/menu", menuRouter);

module.exports = app;
