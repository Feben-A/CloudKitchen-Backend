const { Pool } = require("pg");

// const db = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT || 5432,
//   });

// Connect to the database - requires a DB_URL value to have been loaded into the environment
const db = new Pool({
    connectionString: process.env.DB_URL
})

console.log("DB connection established.");

// Export the connection pool so other files can access it
module.exports = db;