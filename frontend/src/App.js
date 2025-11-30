import './App.css';
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorSignup from "./pages/DoctorSignup";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorRequests from "./pages/DoctorRequests";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Patient */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/patientdashboard" element={<PatientDashboard />} />

        {/* Doctor */}
        <Route path="/doctorsignup" element={<DoctorSignup />} />
        <Route path="/doctordashboard" element={<DoctorDashboard />} />
        <Route path="/doctorrequests" element={<DoctorRequests />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
