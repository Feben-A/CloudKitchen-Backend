const db = require("../db/connect");

class User {
  constructor({ user_id, name, email, password, role, restaurant_id, access_code}) {
    this.user_id = user_id;
    this.name = name
    this.email = email;
    this.password = password;
    this.role = role;
    this.restaurant_id = restaurant_id
    this.access_code = access_code
  }

  static async getAll() {
    console.log("Hello");
    const response = await db.query("SELECT * FROM Users");
    if (response.rows.length === 0) {
      throw new Error("No users found");
    }

    return response.rows;
  }

  static async getRestaurantId(code) {
    console.log(code);
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
    try {
        console.log("Querying for email: ", email);
        const result = await db.query("SELECT * FROM Users WHERE email = $1", [email]);
        console.log("Database result:", result.rows);

        return result.rows.length ? result.rows[0] : null;
    } catch (error) {
        console.error("Database query error:", error);
        throw new Error("Database query failed");
    }
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
    console.log(response.rows[0]);
    return response.rows[0];
  }
}
module.exports = User;
