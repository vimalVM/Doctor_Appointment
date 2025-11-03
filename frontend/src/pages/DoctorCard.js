import React, { useEffect, useState } from "react";
import axios from "axios";

function DoctorList({ patientId }) {
  const [doctors, setDoctors] = useState([]);
  const [selectedDate, setSelectedDate] = useState({});
  const [selectedSlot, setSelectedSlot] = useState({});
  const [activeDoctor, setActiveDoctor] = useState(null);

  const slots = [
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "1:00 PM - 2:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
  ];

  useEffect(() => {
    // Fetch available doctors
    axios
      .get("http://localhost:8081/doctors")
      .then((res) => setDoctors(res.data))
      .catch((err) => console.error("Error fetching doctors:", err));
  }, []);

  useEffect(() => {
  const selectedId = localStorage.getItem("selectedDoctorId");
  if (selectedId) {
    const parsedId = parseInt(selectedId);
    setActiveDoctor(parsedId);
    localStorage.removeItem("selectedDoctorId");

    // Wait for rendering, then scroll that card into view smoothly
    setTimeout(() => {
      const element = document.getElementById(`doctor-card-${parsedId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.style.transition = "box-shadow 0.4s ease";
        element.style.boxShadow = "0 0 15px 3px rgba(0, 123, 255, 0.4)";
        setTimeout(() => {
          element.style.boxShadow = "0 3px 10px rgba(0,0,0,0.1)";
        }, 1500); // highlight briefly
      }
    }, 500);
  }
}, [doctors]);



  const handleBook = (doctorId) => {
    if (activeDoctor === doctorId) {
      const date = selectedDate[doctorId];
      const slot = selectedSlot[doctorId];

      console.log({ doctorId, patientId, date, slot }); // Debug

      if (!date || !slot) {
        alert("Please select both date and slot.");
        return;
      }

      axios
        .post("http://localhost:8081/book-appointment", {
          doctorId: doctorId,
          patientId: patientId, // ✅ comes from props
          date: date,
          slot: slot,
        })
        .then((response) => {
          alert(response.data.message);
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
          if (error.response) {
            alert(error.response.data.message);
          } else {
            alert("Booking failed. Try again.");
          }
        });
    } else {
      setActiveDoctor(doctorId);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        {doctors.map((doctor) => (
          <div
            key={doctor.DoctorID}
            id={`doctor-card-${doctor.DoctorID}`}
            className="col-6 col-sm-4 col-md-3 col-lg-3 mb-4 d-flex justify-content-center"
          >
            <div
              className="card text-center shadow-sm border-0"
              style={{
                width: "15rem",
                transition: "transform 0.2s ease-in-out, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 3px 10px rgba(0,0,0,0.1)";
              }}
            >
              <div className="text-center mt-3">
                <img
                  src={doctor.ProfileImage}
                  alt={doctor.FullName}
                  className="rounded-circle"
                  style={{
                    width: "90px",
                    height: "90px",
                    objectFit: "cover",
                    border: "3px solid #007bff",
                  }}
                />
              </div>

              <div className="card-body p-3">
                <h6 className="card-title mb-1 fw-bold">{doctor.FullName}</h6>
                <p
                  className="card-text text-muted mb-1"
                  style={{ fontSize: "0.85rem" }}
                >
                  {doctor.Specialization}
                </p>
                <p
                  className="text-secondary mb-1"
                  style={{ fontSize: "0.8rem" }}
                >
                  {doctor.HospitalName}
                </p>
                <p
                  className="text-success fw-bold mb-2"
                  style={{ fontSize: "0.9rem" }}
                >
                  ₹{doctor.Fees}
                </p>

                {activeDoctor === doctor.DoctorID && (
                  <div>
                    <input
                      type="date"
                      value={selectedDate[doctor.DoctorID] || ""}
                      onChange={(e) =>
                        setSelectedDate({
                          ...selectedDate,
                          [doctor.DoctorID]: e.target.value,
                        })
                      }
                      className="form-control mb-2"
                    />

                    <select
                      value={selectedSlot[doctor.DoctorID] || ""}
                      onChange={(e) =>
                        setSelectedSlot({
                          ...selectedSlot,
                          [doctor.DoctorID]: e.target.value,
                        })
                      }
                      className="form-select mb-2"
                    >
                      <option value="">Select Slot</option>
                      {slots.map((slot, index) => (
                        <option key={index} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  className="btn btn-sm btn-primary w-100"
                  onClick={() => handleBook(doctor.DoctorID)}
                >
                  {activeDoctor === doctor.DoctorID ? "Confirm Booking" : "Book"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoctorList;
