import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Validation from "../LoginValidation";
import { axiosInstance } from "../lib/axios";

export default function Login() {
  const [userType, setUserType] = useState("patient");
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log(" SELECTED LOGIN TYPE:", userType);

    const validationErrors = Validation(values);
    setErrors(validationErrors);

    if (validationErrors.email || validationErrors.password) return;

    const url = userType === "doctor" ? "/doctorlogin" : "/login";

    console.log("➡ CALLING URL:", url);

    try {
      const res = await axiosInstance.post(url, values);

      if (userType === "patient") {
        localStorage.setItem("patientId", res.data.patientId);
        navigate("/patientdashboard");
      } else {
        localStorage.setItem("doctorId", res.data.doctorId);
        localStorage.setItem("doctorName", res.data.doctorName);
        navigate("/doctordashboard");
      }
    } catch (err) {
      console.error(" LOGIN ERROR:", err);
      alert("Invalid login. Please check your email/password.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
      <div className="bg-white p-4 rounded w-25">

        <h2 className="text-center mb-3">
          {userType === "patient" ? "Patient Login" : "Doctor Login"}
        </h2>

        {/* Toggle Buttons */}
        <div className="mb-3 d-flex gap-2">
          <button
            type="button"
            className={`btn w-50 ${userType === "patient" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setUserType("patient")}
          >
            Patient
          </button>

          <button
            type="button"
            className={`btn w-50 ${userType === "doctor" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setUserType("doctor")}
          >
            Doctor
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label><strong>Email</strong></label>
            <input type="email" name="email" className="form-control" placeholder="Enter email" onChange={handleInput}/>
            {errors.email && <small className="text-danger">{errors.email}</small>}
          </div>

          <div className="mb-3">
            <label><strong>Password</strong></label>
            <input type="password" name="password" className="form-control" placeholder="Enter password" onChange={handleInput}/>
            {errors.password && <small className="text-danger">{errors.password}</small>}
          </div>

          <button type="submit" className="btn btn-success w-100">
            Login
          </button>

          <p className="mt-2 text-center">You agree to our terms & policies</p>

          {userType === "patient" ? (
            <Link to="/signup" className="btn btn-light border w-100">
              Create Patient Account
            </Link>
          ) : (
            <Link to="/doctorsignup" className="btn btn-light border w-100">
              Create Doctor Account
            </Link>
          )}
        </form>
      </div>
    </div>
  );
}
