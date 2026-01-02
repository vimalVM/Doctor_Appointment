import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";

export default function DoctorCompletedAppointments({ doctorId }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (doctorId) {
      fetchCompleted();
    }
    // eslint-disable-next-line
  }, [doctorId]);

  async function fetchCompleted() {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/doctor/appointments/completed/${doctorId}`
      );

      // ✅ ALWAYS normalize to array
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
          ? res.data.data
          : [];

      setAppointments(data);
    } catch (err) {
      console.error("Error fetching completed appointments:", err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <p>Loading completed appointments...</p>;
  }

  if (!appointments.length) {
    return <p className="text-muted">No completed appointments yet.</p>;
  }

  return (
    <>
      {appointments.map((a) => (
        <div key={a.AppointmentID} className="card mb-3 p-3 shadow-sm">
          <h6 className="fw-bold">{a.Patient_Name}</h6>
          <p className="mb-1">📧 {a.Patient_Email}</p>
          <p className="mb-1">📅 {a.AppointmentDate}</p>
          <p className="mb-0">⏰ {a.SlotTime}</p>
        </div>
      ))}
    </>
  );
}
