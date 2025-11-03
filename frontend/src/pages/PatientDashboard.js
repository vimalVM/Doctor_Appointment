/* global bootstrap */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DoctorList from "./DoctorCard";
import UpcomingAppointments from "./UpcomingAppointments"; // add this line

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState("home"); // 'home', 'book', 'upcoming'
  const loggedInPatientId = localStorage.getItem("patientId");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Function to close offcanvas
  const closeOffcanvas = () => {
    const offcanvasElement = document.getElementById("offcanvasNavbar");
    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
    if (bsOffcanvas) {
      bsOffcanvas.hide();
    }
  };

  // Change view and close sidebar
  const handleViewChange = (view) => {
    setCurrentView(view);
    closeOffcanvas();
  };

  const goToLogin = () => {
    const confirmLogout = window.confirm("Are you sure you want to Logout?");
    if (confirmLogout) {
      navigate("/");
    }
  };

  // 🔍 Search function
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:8081/search-doctors?q=${searchTerm}`);
      setSearchResults(res.data);
    } catch (error) {
      console.error("Search error:", error);
      alert("Error fetching search results");
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar bg-body-tertiary bg-primary fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <strong>ClinicHub</strong>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div
            className="offcanvas offcanvas-end"
            tabIndex={-1}
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
                {" "}
                Menu{" "}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              />
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      currentView === "home" ? "active" : ""
                    }`}
                    aria-current="page"
                    href="#"
                    onClick={() => handleViewChange("home")}
                  >
                    Home
                  </a>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Appointment
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={() => handleViewChange("upcoming")}
                      >
                        Upcoming
                      </a>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={() => handleViewChange("book")}
                      >
                        Book
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link text-danger"
                    href="#"
                    onClick={goToLogin}
                  >
                    Logout
                  </a>
                </li>
              </ul>
              <form className="d-flex mt-3" role="search" onSubmit={handleSearch} >
                <input className="form-control me-2" type="search" placeholder="Search doctor by name" aria-label="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                <button className="btn btn-outline-success" type="submit"> Search </button>
              </form>

              {/* 🔍 Display search results below search bar */}
              {searchResults.length > 0 && (
                <div className="mt-3">
                  <h6>Search Results:</h6>
                  {searchResults.map((doctor) => (
                    <div key={doctor.DoctorID} className="card mb-2 p-2 shadow-sm" style={{ cursor: "pointer" }} >
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <img
                            src={doctor.ProfileImage}
                            alt={doctor.FullName}
                            className="rounded-circle me-2"
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                              border: "2px solid #007bff",
                            }}
                          />
                          <div>
                            <h6 className="mb-0">{doctor.FullName}</h6>
                            <small className="text-muted">
                              {doctor.Specialization}
                            </small>
                          </div>
                        </div>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => {
                            setCurrentView("book");
                            setSearchResults([]);
                            setSearchTerm("");
                            localStorage.setItem(
                              "selectedDoctorId",
                              doctor.DoctorID
                            );
                            closeOffcanvas();
                          }}
                        >
                          Book Slot
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mt-5 pt-5">
        {currentView === "home" && (
          <div>
            <h2>Welcome to ClinicHub!</h2>
            <p>
              This is your home page content. You can add dashboard stats,
              latest updates, or welcome message here.
            </p>
          </div>
        )}

        {currentView === "book" && <DoctorList patientId={loggedInPatientId} />}

        {currentView === "upcoming" && (
          <UpcomingAppointments patientId={loggedInPatientId} />
        )}
      </div>
    </>
  );
}
