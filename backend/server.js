require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");// cross origin resource sharing
 //If your React frontend is running on a different port (like 3000), and your backend on 8081, 
 // browsers block the requests by default.
// Using this middleware allows requests between different origins.
const app = express();

app.use(cors()); 
app.use(express.json());//This middleware parses incoming JSON data in the request body.
                          //express.json() automatically converts it into a usable JavaScript object (req.body).
                          /*req.body = {
                                          email: "user@gmail.com",
                                          password: "12345"
                                        }*/



const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "#Vimal2004",
//   database: "doctor_appointment"
// });

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to database.");
});

app.post("/signup", (req, res) => {
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

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM patient_master WHERE Patient_Email = ? AND Patient_Password = ?";
  const values = [req.body.email, req.body.password];

  db.query(sql, values, (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }

    if (data.length > 0) {
      // User found, send patient ID
      const patient = data[0]; // first matched row
      return res.json({ 
        message: "Login successful", 
        patientId: patient.Patient_Id // make sure column name matches your DB
      });
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  });
});


app.get("/doctors", (req, res) => {
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
app.get("/search-doctors", (req, res) => {
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


app.post("/book-appointment", (req, res) => {
  const { doctorId, patientId, date, slot } = req.body;

  if (!doctorId || !patientId || !date || !slot) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Validate date
  if (isNaN(new Date(date).getTime())) {
    return res.status(400).json({ message: "Invalid date format" });
  }

  // Check if slot already booked
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

    // Insert new appointment
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
        appointmentId: result2.insertId
      });
    });
  });
});

// 🆕 Get all upcoming appointments for a patient
app.get("/appointments/:patientId", (req, res) => {
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

app.delete("/appointments/:appointmentId", (req, res) => {
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



app.listen(8081, () => {
  console.log("Server listening on port 8081");
});



// const express = require("express");
// const cors = require("cors");

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Import route files
// const authRoutes = require("./routes/authRoutes");
// const doctorRoutes = require("./routes/doctorRoutes");
// const appointmentRoutes = require("./routes/appointmentRoutes");

// // Use them
// app.use("/auth", authRoutes);
// app.use("/doctors", doctorRoutes);
// app.use("/appointments", appointmentRoutes);

// // Start server
// app.listen(8081, () => {
//   console.log("🚀 Server listening on port 8081");
// });
