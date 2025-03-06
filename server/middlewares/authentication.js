const jwt = require("jsonwebtoken");

function authentication(req, res, next) {
  console.log("[AUTH] Authenticator function called.");

  const token = req.headers['authorization'];

  console.log("[AUTH] Received Token:", token);

  const formattedToken = token.startsWith("Bearer ") ? token.slice(7).trim() : token;

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  console.log("[AUTH] Formatted Token:", formattedToken);

  jwt.verify(formattedToken, process.env.SECRET_TOKEN, async (err, data) => {
    if (err) {
      return res.status(403).json({ err: "No valid token" });
    }

    console.log("[AUTH] Token Verified! Decoded User Data:", data);


    req.name = data.name;
    req.email = data.email;
    req.user_id = data.user_id;
    req.role = data.role;
    req.restaurant_id = data.restaurant_id;
    next();
  });
}

module.exports = authentication;
