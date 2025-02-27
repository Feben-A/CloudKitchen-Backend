const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
  const token = req.header.authorisation;

  if (token) {
    jwt.verify(token, process.env.SECRET_TOKEN, async (err, data) => {
      if (err) {
        res.status(403).json({ err: "No valid token" });
      } else {
        req.user_id = data.user_id;
        // req.restaurant_id = data.restaurant_id;
        next();
      }
    });
  }
};

module.exports = authentication;
