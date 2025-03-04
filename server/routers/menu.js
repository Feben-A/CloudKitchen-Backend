const { Router } = require("express");
const menuController = require("../controllers/menu");
const authentication = require("../middlewares/authentication");

const menuRouter = Router();

menuRouter.get("/", authentication, menuController.index);
menuRouter.get("/names", authentication, menuController.show);
menuRouter.post("/", authentication, menuController.create);

module.exports = menuRouter;
