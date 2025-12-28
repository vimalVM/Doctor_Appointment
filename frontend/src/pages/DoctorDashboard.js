import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DoctorRequests from "./DoctorRequests";
import DoctorAppointments from "./DoctorAppointments";
import DoctorCompletedAppointments from "./DoctorCompletedAppointments";

export default function DoctorDashboard() {
  const [doctorId, setDoctorId] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [activePage, setActivePage] = useState("home");

  const navigate = useNavigate();

  useEffect(() => {
    const storedId = localStorage.getItem("doctorId");
    const storedName = localStorage.getItem("doctorName");

    if (!storedId) {
      navigate("/");
      return;
    }

    setDoctorId(storedId);
    setDoctorName(storedName || "Doctor");
  }, [navigate]);

  const handleRequestUpdate = () => {
    setActivePage("home");
  };

  const handleLogout = () => {
    localStorage.removeItem("doctorId");
    localStorage.removeItem("doctorName"); // cleanup
    navigate("/");
  };

  return (
    <div className="bg-light min-vh-100">
      {/* NAVBAR */}
      <nav className="navbar navbar-dark bg-primary px-3 shadow-sm">
        <button
          className="btn btn-light"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#doctorMenu"
        >
          ☰
        </button>
        <span className="navbar-brand ms-3 fw-bold">ClinicHub</span>
      </nav>

      {/* OFFCANVAS */}
      <div className="offcanvas offcanvas-start" tabIndex="-1" id="doctorMenu">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Menu</h5>
          <button className="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>

        <div className="offcanvas-body">
          <ul className="list-group">
            <li className="list-group-item">
              <button
                className="btn fw-bold text-primary"
                onClick={() => setActivePage("home")}
                data-bs-dismiss="offcanvas"
              >
                Home
              </button>
            </li>

            <li className="list-group-item">
              <button
                className="btn fw-bold text-primary"
                onClick={() => setActivePage("requests")}
                data-bs-dismiss="offcanvas"
              >
                Appointment Requests
              </button>
            </li>

            <li className="list-group-item">
              <button
                className="btn fw-bold text-primary"
                onClick={() => setActivePage("completed")}
                data-bs-dismiss="offcanvas"
              >
                Completed Appointments
              </button>
            </li>

            <li className="list-group-item">
              <button
                className="btn btn-danger w-100 mt-2"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* CONTENT */}
      <div className="container py-4">

        {/* HEADER */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h4 className="fw-bold mb-1">
              Welcome, {doctorName} 👨‍⚕️
            </h4>
            <p className="text-muted mb-0">Doctor ID: {doctorId}</p>
          </div>
        </div>

        {/* HOME */}
        {activePage === "home" && (
          <div className="card shadow-sm">
            <div className="card-header fw-bold bg-white">
              Upcoming Appointments
            </div>
            <div className="card-body">
              <DoctorAppointments doctorId={doctorId} />
            </div>
          </div>
        )}

        {/* REQUESTS */}
        {activePage === "requests" && (
          <div className="card shadow-sm">
            <div className="card-header fw-bold bg-white">
              Appointment Requests
            </div>
            <div className="card-body">
              <DoctorRequests onRequestHandled={handleRequestUpdate} />
            </div>
          </div>
        )}

        {/* COMPLETED */}
        {activePage === "completed" && (
          <div className="card shadow-sm">
            <div className="card-header fw-bold bg-white">
              Completed Appointments
            </div>
            <div className="card-body">
              <DoctorCompletedAppointments doctorId={doctorId} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
