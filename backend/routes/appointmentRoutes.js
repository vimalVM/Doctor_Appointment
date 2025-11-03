const express = require("express");
const router = express.Router();
const db = require("../db");

// Book Appointment
router.post("/book", (req, res) => {
  const { doctorId, patientId, date, slot } = req.body;

  if (!doctorId || !patientId || !date || !slot) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (isNaN(new Date(date).getTime())) {
    return res.status(400).json({ message: "Invalid date format" });
  }

  const checkQuery = `
    SELECT * FROM appointments
    WHERE DoctorID = ? AND AppointmentDate = ? AND SlotTime = ?
  `;

  db.query(checkQuery, [doctorId, date, slot], (err, result) => {
    if (err) {
      console.error("Check query error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length > 0) {
      return res.status(409).json({ message: "Slot already booked" });
    }

    const insertQuery = `
      INSERT INTO appointments (DoctorID, PatientID, AppointmentDate, SlotTime, Status)
      VALUES (?, ?, ?, ?, 'Booked')
    `;

    db.query(insertQuery, [doctorId, patientId, date, slot], (err2, result2) => {
      if (err2) {
        console.error("Insert error:", err2);
        return res.status(500).json({ message: "Database insert failed" });
      }

      res.status(200).json({
        message: "Appointment booked successfully!",
        appointmentId: result2.insertId,
      });
    });
  });
});

// Get Appointments for a Patient
router.get("/:patientId", (req, res) => {
  const { patientId } = req.params;
  const sql = `
    SELECT a.AppointmentID, a.AppointmentDate, a.SlotTime, a.Status,
           d.FullName AS DoctorName, d.Specialization
    FROM appointments a
    JOIN doctor_master d ON a.DoctorID = d.DoctorID
    WHERE a.PatientID = ?
    ORDER BY a.AppointmentDate DESC
  `;
  db.query(sql, [patientId], (err, results) => {
    if (err) {
      console.error("Error fetching appointments:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json(results);
  });
});

// Delete Appointment
router.delete("/:appointmentId", (req, res) => {
  const { appointmentId } = req.params;
  const sql = "DELETE FROM appointments WHERE AppointmentID = ?";
  db.query(sql, [appointmentId], (err, result) => {
    if (err) {
      console.error("Error deleting appointment:", err);
      return res.status(500).json({ message: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({ message: "Appointment cancelled successfully" });
  });
});

module.exports = router;
