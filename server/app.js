const express = require("express");
const cors = require("cors");
const app = express();
const logger = require("./middlewares/logger");

app.use(express.json());
app.use(cors());
app.use(logger);

module.exports = app;
