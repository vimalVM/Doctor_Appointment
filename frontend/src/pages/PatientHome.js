import React from "react";

export default function PatientHome({ onNavigate }) {

  return (
    <>
      {/* ================= HERO / CAROUSEL SECTION ================= */}
      <section className="mb-5">
        <div
          id="carouselExampleCaptions"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            ></button>
          </div>

          <div className="carousel-inner">
            <div className="carousel-item active">
              <img
                src="/doctor_images/slide/slide1.jpg"
                alt="Book Appointment"
                className="d-block w-100"
                style={{
                  height: "70vh",
                  minHeight: "520px",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
              <div className="carousel-caption d-none d-md-block">
                <h5>Book Doctor Appointments</h5>
                <p>Find expert doctors and book instantly.</p>
              </div>
            </div>

            <div className="carousel-item">
              <img
                src="/doctor_images/slide/slide2.jpg"
                alt="Track Appointments"
                className="d-block w-100"
                style={{
                  height: "70vh",
                  minHeight: "520px",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
              <div className="carousel-caption d-none d-md-block">
                <h5>Track Appointments</h5>
                <p>Easy appointment scheduling</p>
              </div>
            </div>

            <div className="carousel-item">
              <img
                src="/doctor_images/slide/slide3.jpg"
                alt="Healthcare"
                className="d-block w-100"
                style={{
                  height: "70vh",
                  minHeight: "520px",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
              <div className="carousel-caption d-none d-md-block">
                <h5>Trusted Healthcare</h5>
                <p>No need of maintaining appointment diaries</p>
              </div>
            </div>
          </div>

          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon"></span>
            <span className="visually-hidden">Previous</span>
          </button>

          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </section>

      {/* ================= WELCOME SECTION ================= */}
      <section className="container my-5 py-5">
        <div className="text-center">
          <h2 className="fw-bold mb-3">Welcome to ClinicHub 👋</h2>
          <p className="text-muted fs-5">
            Manage your appointments, explore doctors, and track your healthcare
            journey easily.
          </p>
        </div>
      </section>

      {/* ================= KEY FEATURES SECTION ================= */}
      <section className="container my-5 pb-5">
        <div className="text-center mb-5">
          <h4 className="fw-bold">KEY FEATURES</h4>
          <p className="text-muted">What we offer</p>
        </div>

        <div className="row g-5">
          {/* Feature 1 */}
          <div className="col-md-4">
            <div className="feature-card text-center h-100">
              <i className="bi bi-people-fill fs-1 mb-3"></i>
              <h5 className="fw-semibold">Patient Management</h5>
              <p className="mt-3">
                Register patients, manage medical history, vitals, prescriptions
                and track visits easily.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="col-md-4">
            <div className="feature-card text-center h-100">
              <i className="bi bi-calendar-check fs-1 mb-3"></i>
              <h5 className="fw-semibold">Appointments</h5>
              <p className="mt-3">
                Book, reschedule or cancel appointments and track appointment
                status in real time.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="col-md-4">
            <div className="feature-card text-center h-100">
              <i className="bi bi-person-badge-fill fs-1 mb-3"></i>
              <h5 className="fw-semibold">Doctors & Consultants</h5>
              <p className="mt-3">
                View doctor profiles, specialization, availability and book
                appointments with ease.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* ================= FOOTER ================= */}

        <footer className="bg-dark text-light mt-5 pt-5">
        <div className="container">
            <div className="row text-center text-md-start">

            {/* Brand */}
            <div className="col-md-4 mb-4">
                <h5 className="fw-bold">ClinicHub</h5>
                <p className="text-light small mt-2">
                A smart doctor appointment booking system to manage 
                healthcare efficiently and securely.
                </p>
            </div>

            {/* Quick Links */}
            <div className="col-md-4 mb-4">
                <h6 className="fw-semibold mb-3">Quick Links</h6>
                <ul className="list-unstyled">
                    <li className="mb-2">
                    <button
                        className="btn btn-link text-decoration-none text-light p-0"
                        onClick={() => onNavigate("home")}
                    >
                        Home
                    </button>
                    </li>

                    <li className="mb-2">
                    <button
                        className="btn btn-link text-decoration-none text-light p-0"
                        onClick={() => onNavigate("book")}
                    >
                        Book Appointment
                    </button>
                    </li>

                    <li className="mb-2">
                    <button
                        className="btn btn-link text-decoration-none text-light p-0"
                        onClick={() => onNavigate("upcoming")}
                    >
                        Upcoming Appointments
                    </button>
                    </li>
                </ul>
            </div>


            {/* Contact */}
            <div className="col-md-4 mb-4">
                <h6 className="fw-semibold mb-3">Contact</h6>
                <p className="small mb-1">📍 India</p>
                <p className="small mb-1">📧 support@clinichub.com</p>
                <p className="small mb-1">📞 +91 98765 43210</p>
            </div>
            </div>

            <hr className="border-secondary" />

            <div className="text-center pb-3 small text-white">
            © {new Date().getFullYear()} ClinicHub. All rights reserved.
            </div>
        </div>
        </footer>


    </>
  );
}
