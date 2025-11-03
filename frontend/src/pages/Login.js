import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Validation from "../LoginValidation";
import axios from "axios";

export default function Login() {
  

  const [values, setValues] = useState({
    email: "",
    password: "",
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

    if (validationErrors.email === "" && validationErrors.password === "") {
      axios
        .post("http://localhost:8081/login", values)
        .then((res) => {
          // Save patientId to localStorage
          localStorage.setItem("patientId", res.data.patientId);
          console.log("Login result:", res.data);
          console.log("Logged in patient id:", res.data.patientId);
          navigate("/patientdashboard");
        })
        .catch((err) => console.log(err));
    }
  };


  return (
    <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Login</h2>
        <form action="" onSubmit={handleSubmit}>

          <div className="mb-3">
            <label htmlFor="email" className="d-block"> <strong>Email</strong></label>
            <input type="email" name="email" placeholder="Enter email" className="form-control rounded-0" onChange={handleInput}/>
            {errors.email && ( <span className="text-danger">{errors.email}</span>)}
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="d-block"> <strong>Password</strong> </label>
            <input type="password" name="password" placeholder="Enter password" className="form-control rounded-0" onChange={handleInput} />
            {errors.password && ( <span className="text-danger">{errors.password}</span> )}
          </div>

          <button type="submit" className="btn btn-success w-100"> <strong>Login</strong> </button>

          <p>You are agree to our terms and policies</p>

          <Link to="/signup" className="btn btn-default border w-100 bg-light text-decoration-none"> Create Account </Link>

        </form>
      </div>
    </div>
  );
}
