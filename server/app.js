const express = require("express");
const cors = require("cors");
const app = express();
const logger = require("./middlewares/logger");
const userRouter = require("./routers/users");

app.use(express.json());
app.use(cors());
app.use(logger);

app.use("/users", userRouter);

module.exports = app;
