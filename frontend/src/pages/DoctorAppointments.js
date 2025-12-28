import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";

export default function DoctorAppointments({ doctorId }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
    console.log("DoctorAppointments mounted for doctor:", doctorId);
    if (doctorId) {
        fetchAppointments();
    }
    }, [doctorId]);


  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/doctor/appointments/${doctorId}`
      );

      // ✅ Ensure appointments is always an array
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
        ? res.data.data
        : [];

      setAppointments(data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const markCompleted = async (appointmentId) => {
    try {
      await axiosInstance.post("/doctor/complete", {
        appointmentId,
      });
      fetchAppointments(); // refresh list
    } catch (err) {
      console.error("Error completing appointment:", err);
      alert("Failed to mark appointment as completed");
    }
  };

  const sendMail = (email, patientName, date, slot) => {
        const subject = encodeURIComponent("Appointment Update - ClinicHub");
        const body = encodeURIComponent(
            `Hello ${patientName},\n\nThere is a delay in your appointment.\n\nDate: ${date}\nSlot: ${slot}\n\nRegards,\nClinicHub`
        );

        const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;

        window.open(gmailURL, "_blank");
    };


  return (
    <div>
      <h4 className="mb-3">Upcoming Appointments</h4>

      {/* Loading */}
      {loading && <p>Loading appointments...</p>}

      {/* Empty state */}
      {!loading && appointments.length === 0 && (
        <p className="text-muted">No upcoming appointments</p>
      )}

      {/* Appointment Cards */}
      {!loading &&
        Array.isArray(appointments) &&
        appointments.map((a) => (
          <div key={a.AppointmentID} className="card mb-3 p-3 shadow-sm">
            <h6 className="fw-bold">{a.Patient_Name}</h6>

            <p className="mb-1">📧 {a.Patient_Email}</p>
            <p className="mb-1">📅 {a.AppointmentDate}</p>
            <p className="mb-2">⏰ {a.SlotTime}</p>

            <div className="d-flex gap-2">
              <button
                className="btn btn-success btn-sm"
                onClick={() => markCompleted(a.AppointmentID)}
              >
                Completed
              </button>

              <button className="btn btn-warning btn-sm" onClick={() => sendMail(a.Patient_Email,a.Patient_Name,new Date(a.AppointmentDate).toLocaleDateString(),a.SlotTime)}>
                    Message
              </button>

            </div>
          </div>
        ))}
    </div>
  );
}
