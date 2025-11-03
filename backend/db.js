// db.js
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "#Vimal2004",
  database: "doctor_appointment",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.stack);
    return;
  }
  console.log("✅ Connected to MySQL database.");
});

module.exports = db;
