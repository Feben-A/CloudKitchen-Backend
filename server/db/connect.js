const fs = require('fs');
require("dotenv").config(); // Load environment config

// Load in the SQL statements
const sql = fs.readFileSync(__dirname + '/setup.sql').toString();

// Get a link to the database
const db = require("./db");

// Run the query
db.query(sql)
    .then(data => console.log("Set-up complete."))
    .catch(error => console.log(error));