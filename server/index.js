const app = require("./app");
require("dotenv").config();
const port = process.env.PORT;

app.listen(port, () => {
  `App is listening on port: ${port}`;
});
