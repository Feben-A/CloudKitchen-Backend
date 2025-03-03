const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  if (token) {
    jwt.verify(token, process.env.SECRET_TOKEN, async (err, data) => {
      if (err) {
        res.status(403).json({ err: "No valid token" });
      }

      req.name = data.name;
      req.user_id = data.user_id;
      req.role = data.role;
      req.restaurant_id = data.restaurant_id;
      next();
    });
  }
};

module.exports = authentication;
