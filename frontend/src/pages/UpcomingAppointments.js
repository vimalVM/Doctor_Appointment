import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";

export default function UpcomingAppointments({ patientId }) {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("Pending");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) return;
    fetchAppointments();
  }, [patientId]);

  useEffect(() => {
    filterAppointments();
  }, [statusFilter, appointments]);

  const fetchAppointments = () => {
    setLoading(true);

    axiosInstance
      .get(`/appointments/${patientId}`)
      .then((res) => {
        setAppointments(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching appointments:", err);
        setLoading(false);
      });
  };

  const filterAppointments = () => {
    setFilteredAppointments(
      appointments.filter((a) => a.Status === statusFilter)
    );
  };

  const handleCancel = (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?"))
      return;

    axiosInstance
      .delete(`/appointments/${appointmentId}`)
      .then(() => {
        alert("Appointment cancelled successfully.");
        setAppointments((prev) =>
          prev.filter((appt) => appt.AppointmentID !== appointmentId)
        );
      })
      .catch(() => alert("Failed to cancel appointment."));
  };

  if (loading) return <p>Loading appointments...</p>;

  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>🩺 Your Appointments</h3>

        {/* STATUS DROPDOWN */}
        <select
          className="form-select w-auto"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="Pending">Pending</option>
          <option value="Confirmed">Booked</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {filteredAppointments.length === 0 ? (
        <p className="text-muted">
          No {statusFilter.toLowerCase()} appointments.
        </p>
      ) : (
        <div className="row">
          {filteredAppointments.map((appt) => (
            <div key={appt.AppointmentID} className="col-md-4 mb-3">
              <div className="card shadow-sm p-3 rounded position-relative">

                {/* CANCEL BUTTON */}
                {(appt.Status === "Pending" || appt.Status === "Confirmed") && (
                  <button
                    className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                    onClick={() => handleCancel(appt.AppointmentID)}
                  >
                    ✖
                  </button>
                )}

                <h5 className="mt-3">{appt.DoctorName}</h5>

                <p><strong>Specialization:</strong> {appt.Specialization}</p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(appt.AppointmentDate).toLocaleDateString()}
                </p>
                <p><strong>Slot:</strong> {appt.SlotTime}</p>

                <span
                  className={`badge ${
                    appt.Status === "Pending"
                      ? "bg-warning text-dark"
                      : appt.Status === "Confirmed"
                      ? "bg-primary"
                      : "bg-success"
                  }`}
                >
                  {appt.Status}
                </span>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
