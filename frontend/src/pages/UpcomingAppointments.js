import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";

export default function UpcomingAppointments({ patientId }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) return;
    fetchAppointments();
  }, [patientId]);

  const fetchAppointments = () => {
    setLoading(true);
  
    axiosInstance.get(`/appointments/${patientId}`)
      .then((res) => {
        setAppointments(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching appointments:", err);
        setLoading(false);
      });
  };

  const handleCancel = (appointmentId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmCancel) return;

    axiosInstance
      .delete(`/appointments/${appointmentId}`)
      .then(() => {
        alert("Appointment cancelled successfully.");
        setAppointments((prev) =>
          prev.filter((appt) => appt.AppointmentID !== appointmentId)
        );
      })
      .catch((err) => {
        console.error("Error cancelling appointment:", err);
        alert("Failed to cancel appointment. Please try again.");
      });
  };

  if (loading) return <p>Loading appointments...</p>;

  return (
    <div className="container mt-3">
      <h3 className="mb-4">🩺 Your Appointments</h3>

      {appointments.length === 0 ? (
        <p className="text-muted">No appointments found.</p>
      ) : (
        <div className="row">
          {appointments.map((appt) => (
            <div key={appt.AppointmentID} className="col-md-4 mb-3">
              <div className="card shadow-sm p-3 rounded position-relative">

                {/*  Hide cancel for Rejected */}
                {appt.Status !== "Rejected" && (
                  <button
                    className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                    onClick={() => handleCancel(appt.AppointmentID)}
                    title="Cancel appointment"
                  >
                    ✖
                  </button>
                )}

                <h5 className="card-title mt-3">{appt.DoctorName}</h5>
                <p><strong>Specialization:</strong> {appt.Specialization}</p>
                <p><strong>Date:</strong> {new Date(appt.AppointmentDate).toLocaleDateString()}</p>
                <p><strong>Slot:</strong> {appt.SlotTime}</p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`badge ${
                      appt.Status === "Pending"
                        ? "bg-warning text-dark"
                        : appt.Status === "Confirmed"
                        ? "bg-success"
                        : appt.Status === "Rejected"
                        ? "bg-danger"
                        : "bg-secondary"
                    }`}
                  >
                    {appt.Status}
                  </span>
                </p>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
