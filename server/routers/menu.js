const { Router } = require("express");
const menuController = require("../controllers/menu");

const menuRouter = Router();

// menuRouter.post("/", menuController.create);

module.exports = menuRouter;
