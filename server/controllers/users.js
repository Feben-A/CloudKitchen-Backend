const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function index(req, res) {
  try {
    const response = User.getAll();
    res.status(200).json({ response });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function register(req, res) {
  try {
    console.log(req.body);
    const data = req.body;
    const restaurant_id = await User.getRestaurantId(data.restaurant_code);

    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS));
    data["password"] = await bcrypt.hash(data.password, salt);
    const result = await User.create(data, restaurant_id);
    res.status(201).send(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function login(req, res) {
  const data = req.body;
  try {
    const user = await User.getUserByUsername(data.name);
    if (!user) {
      throw new Error("No user found.");
    }
    const match = await bcrypt.compare(data.password, user.password);

    if (match) {
      const payload = {
        user_id: user.user_id,
        restaurant_id: user.restaurant_id,
      };
      console.log("signing jwt");
      const token = jwt.sign(payload, process.env.SECRET_TOKEN, {
        expiresIn: 3600,
      });
      res.status(200).json({
        success: true,
        token: token,
      });
    } else {
      throw new Error("User could not be authenticated");
    }
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

module.exports = {
  login,
  register,
  index,
};
