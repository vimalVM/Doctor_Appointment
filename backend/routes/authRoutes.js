const express = require("express");
const router = express.Router();
const db = require("../db");

// Signup
router.post("/signup", (req, res) => {
  const sql = "INSERT INTO patient_master (Patient_Name, Patient_Email, Patient_Password) VALUES (?)";
  const values = [req.body.name, req.body.email, req.body.password];

  db.query(sql, [values], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
    return res.json({ message: "User registered successfully!", data });
  });
});

// Login
router.post("/login", (req, res) => {
  const sql = "SELECT * FROM patient_master WHERE Patient_Email = ? AND Patient_Password = ?";
  const values = [req.body.email, req.body.password];

  db.query(sql, values, (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }

    if (data.length > 0) {
      const patient = data[0];
      return res.json({
        message: "Login successful",
        patientId: patient.Patient_Id,
      });
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  });
});

module.exports = router;
