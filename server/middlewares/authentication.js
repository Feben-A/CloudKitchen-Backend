const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
  const token = req.header.authorisation;

  if (token) {
    jwt.verify(token, process.env.SECRET_TOKEN, async (err, data) => {
      if (err) {
        res.status(403).json({ err: "No valid token" });
      } else {
        req.name = data.name;
        req.user_id = data.user_id;
        req.role = data.role;
        req.restaurant_id = data.restaurant_id;
        next();
      }
    });
  }
};

module.exports = authentication;
