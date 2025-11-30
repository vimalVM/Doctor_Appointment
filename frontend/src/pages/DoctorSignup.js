import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Validation from "../SignupValidation";
import { axiosInstance } from "../lib/axios";

export default function DoctorSignup() {
  const [values, setValues] = useState({
    fullName: "",
    specialization: "",
    experience: "",
    hospitalName: "",
    contactNumber: "",
    email: "",
    city: "",
    fees: "",
    availability: "",
    password: ""
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = Validation(values);
    setErrors(validationErrors);

    if (
      validationErrors.fullName === "" &&
      validationErrors.email === "" &&
      validationErrors.password === ""
    ) {
    axiosInstance
        .post("/doctorsignup", values)
        .then((res) => {
          console.log("Doctor Signup Successful:", res.data);
          navigate("/"); // back to login page
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
      <div className="bg-white p-4 rounded w-25">

        <h2>Doctor Registration</h2>

        <form onSubmit={handleSubmit}>

          <Input label="Full Name" name="fullName" onChange={handleInput} error={errors.fullName} />
          <Input label="Specialization" name="specialization" onChange={handleInput} />
          <Input label="Experience" name="experience" type="number" onChange={handleInput} />
          <Input label="Hospital Name" name="hospitalName" onChange={handleInput} />
          <Input label="Contact Number" name="contactNumber" onChange={handleInput} />
          <Input label="Email" name="email" type="email" onChange={handleInput} error={errors.email} />
          <Input label="City" name="city" onChange={handleInput} />
          <Input label="Fees" name="fees" type="number" onChange={handleInput} />
          <Input label="Availability" name="availability" onChange={handleInput} />
          <Input label="Password" name="password" type="password" onChange={handleInput} error={errors.password} />

          <button type="submit" className="btn btn-success w-100">Register Doctor</button>

          <p className="mt-2">You agree to our terms and policies</p>

          <Link to="/" className="btn btn-default border w-100 bg-light text-decoration-none">
            Login
          </Link>

        </form>
      </div>
    </div>
  );
}

function Input({ label, name, onChange, type="text", error }) {
  return (
    <div className="mb-3">
      <label><strong>{label}</strong></label>
      <input
        name={name}
        type={type}
        className="form-control rounded-0"
        onChange={onChange}
      />
      {error && <span className="text-danger">{error}</span>}
    </div>
  );
}
