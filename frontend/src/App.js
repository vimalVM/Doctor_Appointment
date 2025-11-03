import logo from './logo.svg';
import './App.css';
import React from 'react';
import Login from './pages/Login';
import {BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import PatientDashboard from './pages/PatientDashboard'

function App() {
  return (
    <BrowserRouter> 
      <Routes>
            <Route path='/' element={<Login/>}></Route>
            <Route path='/signup' element={<Signup/>}></Route>
            <Route path='/patientdashboard' element={<PatientDashboard/>}></Route>
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
