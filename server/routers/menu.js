const { Router } = require("express");
const menuController = require("../controllers/menu");

const menuRouter = Router();

// menuRouter.post("/", menuController.create);

menuRouter.get("/names", menuController.show);

module.exports = menuRouter;
