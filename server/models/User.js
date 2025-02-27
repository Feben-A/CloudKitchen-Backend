const db = require("../db/connect");

class User {
  static async getAll() {
    const response = await db.query("SELECT * FROM Users");
    if (response.rows.length === 0) {
      throw new Error("No users found");
    }

    return response.rows.map((user) => new User(user));
  }

  static async getRestaurantId(code) {
    console.log(code);
    console.log(db);
    const response = await db.query(
      "SELECT restaurant_id FROM Restaurants WHERE LOWER(restaurant_code) = LOWER($1) LIMIT 1;",
      [code]
    );

    console.log(response.rows[0]);

    if (response.rows.length != 1) {
      throw new Error("Unable to find restaurant code");
    }

    return response.rows[0].restaurant_id;
  }

  static async getStaffByEmail(email) {
    const response = await db.query("SELECT * FROM Users WHERE email = $1;", [
      email,
    ]);

    if (response.rows.length != 1) {
      throw new Error("Unable to find user");
    }

    return response.rows[0];
  }

  static async create(data, restaurant_id) {
    const { name, email, password, role, access_code } = data;

    const response = await db.query(
      "INSERT INTO Users (name, email, password, role, restaurant_id, access_code) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, email, password, role, restaurant_id, access_code]
    );
    if (response.rows.length === 0) {
      throw new Error("Unable to register staff");
    }
    return response.rows[0];
  }
}
module.exports = User;
