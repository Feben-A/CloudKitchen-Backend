const { Router } = require("express");
const menuController = require("../controllers/menu");
const authentication = require("../middlewares/authentication");

const menuRouter = Router();

menuRouter.get("/", menuController.index);
menuRouter.get("/names", menuController.show);
menuRouter.post("/", menuController.create);

module.exports = menuRouter;
