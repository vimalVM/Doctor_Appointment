import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";

export default function DoctorRequests({ onRequestHandled }) {

  const [doctorId, setDoctorId] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load doctor ID from localStorage
  useEffect(() => {
    const id = localStorage.getItem("doctorId");
    if (id) {
      setDoctorId(id);
      fetchRequests(id);
    }
  }, []);

  // Fetch requests from backend
  const fetchRequests = (id) => {
    setLoading(true);

    axiosInstance
      .get(`/doctor/requests/${id}`)
      .then((res) => {
        setRequests(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading requests:", err);
        setLoading(false);
      });
  };

  // Accept appointment
  const handleAccept = (appointmentId) => {
      axiosInstance
        .post("/doctor/accept", { appointmentId })
        .then(() => {
          alert("Appointment Accepted!");
          setRequests(requests.filter((r) => r.AppointmentID !== appointmentId));

          // ✅ Notify dashboard to go to Home
          onRequestHandled();
        })
        .catch((err) => console.error(err));
  };


  // Reject appointment
  const handleReject = (appointmentId) => {
    axiosInstance
      .post("/doctor/reject", { appointmentId })
      .then(() => {
        alert("Appointment Rejected!");
        setRequests(requests.filter((r) => r.AppointmentID !== appointmentId));
      })
      .catch((err) => console.error(err));
  };


  if (loading) return <h3 className="mt-4 text-center">Loading requests...</h3>;

  return (
    <div className="container mt-4">
      <h2 className="mb-3"> Appointment Requests</h2>

      {requests.length === 0 ? (
        <p className="text-muted">No pending requests.</p>
      ) : (
        <div className="row">
          {requests.map((req) => (
            <div key={req.AppointmentID} className="col-md-4 mb-3">
              <div className="card shadow-sm p-3">

                <h5 className="fw-bold">{req.Patient_Name}</h5>
                <p className="mb-1"><strong>Email:</strong> {req.Patient_Email}</p>
                <p className="mb-1"><strong>Date:</strong> {new Date(req.AppointmentDate).toLocaleDateString()}</p>
                <p className="mb-1"><strong>Slot:</strong> {req.SlotTime}</p>

                <div className="d-flex gap-2 mt-3">
                  <button className="btn btn-success w-50" onClick={() => handleAccept(req.AppointmentID)}> Accept </button>

                  <button className="btn btn-danger w-50" onClick={() => handleReject(req.AppointmentID)}> Reject </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
