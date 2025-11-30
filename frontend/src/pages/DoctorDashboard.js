import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DoctorRequests from "./DoctorRequests";

export default function DoctorDashboard() {
  const [doctorId, setDoctorId] = useState("");
  const [activePage, setActivePage] = useState("home");

  const navigate = useNavigate();

  useEffect(() => {
    const storedId = localStorage.getItem("doctorId");
    if (!storedId) navigate("/");
    setDoctorId(storedId);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("doctorId");
    navigate("/");
  };

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar navbar-dark bg-primary px-3">
        <button
          className="btn btn-light"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#doctorMenu"
        >
          ☰ Menu
        </button>

        <span className="navbar-brand ms-3 fw-bold">ClinicHub</span>
      </nav>

      {/* OFFCANVAS MENU */}
      <div className="offcanvas offcanvas-start" tabIndex="-1" id="doctorMenu">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Doctor Menu</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>

        <div className="offcanvas-body">
          <ul className="list-group">

            {/* HOME */}
            <li className="list-group-item">
              <button
                className="btn fw-bold text-primary"
                onClick={() => setActivePage("home")}
                data-bs-dismiss="offcanvas"
              >
                Home
              </button>
            </li>

            {/* APPOINTMENT REQUESTS */}
            <li className="list-group-item">
              <button
                className="btn fw-bold text-primary"
                onClick={() => setActivePage("requests")}
                data-bs-dismiss="offcanvas"
              >
                Appointment Requests
              </button>
            </li>

            {/* LOGOUT */}
            <li className="list-group-item">
              <button className="btn btn-danger w-100 mt-2" onClick={handleLogout}>
                Logout
              </button>
            </li>

          </ul>
        </div>
      </div>

      {/* PAGE CONTENT */}
      <div className="container mt-4 pt-3">
        <h3>Welcome Doctor ID: {doctorId}</h3>
        <hr />

        {activePage === "home" && (
          <div>
            <h4>Dashboard Home</h4>
            <p>Select an option from the menu.</p>
          </div>
        )}

        {activePage === "requests" && (
          <DoctorRequests doctorId={doctorId} />
        )}
      </div>
    </div>
  );
}
