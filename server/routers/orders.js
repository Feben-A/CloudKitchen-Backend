const { Router } = require("express");
const orderController = require("../controllers/orders");
const authentication = require("../middlewares/authentication");

const orderRouter = Router();

orderRouter.get("/", orderController.index);
orderRouter.post("/", orderController.create);
orderRouter.delete("/:id", orderController.remove);
orderRouter.patch("/:id", orderController.update);
//n.b add in the authentication after testing it.

module.exports = orderRouter;
