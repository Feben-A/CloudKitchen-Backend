const db = require("../db/connect");

class User {
  constructor({ user_id, name, email, password, role }) {
    (this.user_id = user_id),
      (this.name = name),
      (this.email = email),
      (this.password = password);
    this.role = role;
  }

  static async getAll() {
    const response = await db.query("SELECT * FROM Users");
    if (response.rows.length === 0) {
      throw new Error("No users found");
    }

    return response.rows.map((user) => new User(user));
  }

  static async getStaffByUsername(name) {
    const response = await db.query("SELECT * FROM students WHERE name = $1;", [
      name,
    ]);
    if (response.rows.length != 1) {
      throw new Error("User does not exist!");
    }
    return new User(response.rows[0]);
  }

  static async create(data) {
    const { name, email, password, role } = data;
    try {
      const response = await db.query(
        "INSERT INTO Users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *;",
        [name, email, password, role]
      );
      return new User(response.rows[0]);
    } catch (err) {
      console.log({ error: err.message });
    }
  }
}

module.exports = User;
