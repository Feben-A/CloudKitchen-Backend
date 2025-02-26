const { Router } = require("express");
const userController = require("../controllers/users");

const userRouter = Router();

userRouter.post(
  "/register",
  userController.register
);
userRouter.post("/login", userController.login);
userRouter.get("/", userController.index);

module.exports = userRouter;
