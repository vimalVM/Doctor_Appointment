require("dotenv").config();
const path = require("path");
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");// cross origin resource sharing
 //If your React frontend is running on a different port (like 3000), and your backend on 5000, 
 // browsers block the requests by default.
// Using this middleware allows requests between different origins.
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"], 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());//This middleware parses incoming JSON data in the request body.
                          //express.json() automatically converts it into a usable JavaScript object (req.body).
                          /*req.body = {
                                          email: "user@gmail.com",
                                          password: "12345"
                                        }*/


// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT,
// });

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "#Vimal2004",
  database: "doctor_appointment"
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to database.");
});

app.post("/api/signup", (req, res) => {
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

app.post("/api/login", (req, res) => {
  console.log(" Patient Login Request Received:", req.body);

  const sql =
    "SELECT * FROM patient_master WHERE Patient_Email = ? AND Patient_Password = ?";
  const values = [req.body.email, req.body.password];

  db.query(sql, values, (err, data) => {
    if (err) {
      console.error(" SQL ERROR:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (data.length > 0) {
      const patient = data[0];
      console.log(" Patient Found:", patient);
      return res.json({
        message: "Login successful",
        patientId: patient.Patient_Id,
      });
    } else {
      console.log(" Invalid Credentials");
      return res.status(401).json({ message: "Invalid email or password" });
    }
  });
});

// doctor login
//  Doctor Login
app.post("/api/doctorlogin", (req, res) => {
  const { email, password } = req.body;

  const sql = `
    SELECT DoctorID, FullName, Email 
    FROM doctor_master 
    WHERE Email = ? AND Password = ?
  `;

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.error("Doctor login error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const doctor = result[0];

    // ✅ SEND BOTH ID AND NAME
    res.json({
      doctorId: doctor.DoctorID,
      doctorName: doctor.FullName
    });
  });
});




app.get("/api/doctors", (req, res) => {
  const sql = "SELECT * FROM doctor_master WHERE Status = 'Available'";

  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error fetching doctors:", err);
      return res.status(500).json({ error: "Database error" });
    }
    return res.json(data);
  });
});

// 🔍 Search doctors by name
app.get("/api/search-doctors", (req, res) => {
  const search = req.query.q;

  if (!search || search.trim() === "") {
    return res.json([]); // return empty list if no search term
  }

  const sql = `
    SELECT * FROM doctor_master
    WHERE FullName LIKE ? AND Status = 'Available'
  `;
  db.query(sql, [`%${search}%`], (err, data) => {
    if (err) {
      console.error("Error searching doctors:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(data);
  });
});

// ================== BOOK APPOINTMENT (PATIENT) ==================
app.post("/api/book-appointment", (req, res) => {
  const { doctorId, patientId, date, slot } = req.body;

  if (!doctorId || !patientId || !date || !slot) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // 1️⃣ Check if slot already booked or confirmed
  const checkQuery = `
    SELECT AppointmentID
    FROM appointments
    WHERE DoctorID = ?
      AND AppointmentDate = ?
      AND SlotTime = ?
      AND Status IN ('Pending', 'Booked', 'Confirmed')
  `;

  db.query(checkQuery, [doctorId, date, slot], (err, rows) => {
    if (err) {
      console.error("Slot check error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // 🚫 Slot already taken
    if (rows.length > 0) {
      return res.status(409).json({
        message: "This time slot is already booked. Please select another slot."
      });
    }

    // 2️⃣ Slot is free → insert appointment
    const insertQuery = `
      INSERT INTO appointments
      (DoctorID, PatientID, AppointmentDate, SlotTime, Status)
      VALUES (?, ?, ?, ?, 'Pending')
    `;

    db.query(
      insertQuery,
      [doctorId, patientId, date, slot],
      (err, result) => {
        if (err) {
          console.error("Insert error:", err);
          return res.status(500).json({ message: "Database insert failed" });
        }

        res.status(200).json({
          message: "Appointment request sent to doctor!",
          appointmentId: result.insertId
        });
      }
    );
  });
});


//  Get all upcoming appointments for a patient
app.get("/api/appointments/:patientId", (req, res) => {
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

app.delete("/api/appointments/:appointmentId", (req, res) => {
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



// ================== DOCTOR: VIEW REQUESTS ==================
app.get("/api/doctor/requests/:doctorId", (req, res) => {
  const { doctorId } = req.params;

  const sql = `
    SELECT 
      a.AppointmentID, 
      a.AppointmentDate, 
      a.SlotTime, 
      a.Status,
      p.Patient_Name, 
      p.Patient_Email
    FROM appointments a
    JOIN patient_master p ON a.PatientID = p.Patient_Id
    WHERE a.DoctorID = ? AND a.Status = 'Pending'
  `;

  db.query(sql, [doctorId], (err, results) => {
    if (err) {
      console.error("Error fetching doctor requests:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
});

// ================== DOCTOR ACCEPT ==================
app.post("/api/doctor/accept", (req, res) => {
  const { appointmentId } = req.body;

  const sql = "UPDATE appointments SET Status = 'Confirmed' WHERE AppointmentID = ?";

  db.query(sql, [appointmentId], (err) => {
    if (err) {
      console.error("Error updating appointment:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json({ message: "Appointment Accepted" });
  });
});

// ================== DOCTOR REJECT ==================
app.post("/api/doctor/reject", (req, res) => {
  const { appointmentId } = req.body;

  const sql = "UPDATE appointments SET Status = 'Rejected' WHERE AppointmentID = ?";

  db.query(sql, [appointmentId], (err) => {
    if (err) {
      console.error("Error updating appointment:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json({ message: "Appointment Rejected" });
  });
});


// Doctor confirmed / booked appointments
app.get("/api/doctor/appointments/:doctorId", (req, res) => {
  const { doctorId } = req.params;

  const sql = `
    SELECT a.AppointmentID, a.AppointmentDate, a.SlotTime, a.Status,
           p.Patient_Name, p.Patient_Email
    FROM appointments a
    JOIN patient_master p ON a.PatientID = p.Patient_Id
    WHERE a.DoctorID = ? AND a.Status = 'Confirmed'
    ORDER BY a.AppointmentDate
  `;

  db.query(sql, [doctorId], (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});


// ================== DOCTOR MARK COMPLETED ==================
app.post("/api/doctor/complete", (req, res) => {
  const { appointmentId } = req.body;

  const sql =
    "UPDATE appointments SET Status = 'Completed' WHERE AppointmentID = ?";

  db.query(sql, [appointmentId], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Appointment marked as completed" });
  });
});

// ================== DOCTOR COMPLETED HISTORY ==================
app.get("/api/doctor/appointments/completed/:doctorId", (req, res) => {
  const { doctorId } = req.params;

  const sql = `
    SELECT a.AppointmentID, a.AppointmentDate, a.SlotTime,
           p.Patient_Name, p.Patient_Email
    FROM appointments a
    JOIN patient_master p ON a.PatientID = p.Patient_Id
    WHERE a.DoctorID = ? AND a.Status = 'Completed'
    ORDER BY a.AppointmentDate DESC
  `;

  db.query(sql, [doctorId], (err, data) => {
    if (err) return res.status(500).json([]);
    res.json(data); // ALWAYS ARRAY
  });
});


const frontendPath = path.join(__dirname, "../frontend/build");
app.use(express.static(frontendPath));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message });
});

app.listen(5000, () => {
  console.log("Server listening on port 5000");
});


