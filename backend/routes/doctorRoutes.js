const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  const sql = "SELECT * FROM Doctor_Master WHERE Status = 'Available'";
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error fetching doctors:", err);
      return res.status(500).json({ error: "Database error" });
    }
    return res.json(data);
  });
});

module.exports = router;
