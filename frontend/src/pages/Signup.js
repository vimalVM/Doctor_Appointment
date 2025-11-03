import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Validation from "../SignupValidation";
import axios from "axios";

export default function Signup() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleInput = (event) => {
    setValues((prev) => ({ 
      ...prev,
       [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = Validation(values); // run validation first
    setErrors(validationErrors); // update state

    // if no errors, proceed to submit
    if ( validationErrors.name === "" && validationErrors.email === "" && validationErrors.password === "") {
      axios
        .post("http://localhost:8081/signup", values)
        .then((res) => {
          console.log("Signup successful:", res.data);
          navigate("/");
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
      <div className="bg-white p-3 rounded w-25">

        <h2>Sign-Up</h2>

        <form action="" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="d-block"> <strong>Name</strong> </label>
            <input name="name" type="text" placeholder="Enter your name" className="form-control rounded-0" onChange={handleInput}/>
            {errors.name && <span className="text-danger">{errors.name}</span>}
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="d-block"> <strong>Email</strong> </label>
            <input name="email" type="email" placeholder="Enter email" className="form-control rounded-0" onChange={handleInput} />
            {errors.email && ( <span className="text-danger">{errors.email}</span> )}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="d-block"> <strong>Password</strong> </label>
            <input name="password" type="password" placeholder="Enter password" className="form-control rounded-0" onChange={handleInput}/>
            {errors.password && (<span className="text-danger">{errors.password}</span>)}
          </div>

          <button type="submit" className="btn btn-success w-100"> <strong>Signup</strong> </button>

          <p>You are agree to our terms and policies</p>

          <Link to="/" className="btn btn-default border w-100 bg-light text-decoration-none">Login </Link>

        </form>
      </div>
    </div>
  );
}


