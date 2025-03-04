const { Router } = require("express");
const orderController = require("../controllers/orders");
const authentication = require("../middlewares/authentication");

const orderRouter = Router();

orderRouter.get("/", authentication, orderController.index);
orderRouter.post("/", authentication, orderController.create);
orderRouter.delete("/:id", authentication, orderController.remove);
orderRouter.patch("/:id", authentication, orderController.update);

// orderRouter.get("/", orderController.index);
// orderRouter.post("/", orderController.createOrder);
// orderRouter.delete("/:id", orderController.remove);
// orderRouter.patch("/:id", orderController.update);

module.exports = orderRouter;
