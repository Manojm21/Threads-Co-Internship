import React from 'react';
import { Link } from 'react-router-dom';
import tcLogo from '../assets/image.png';
import axios from 'axios';
import CONFIG from '../config';
import { showAlert } from '../utils/alertUtils'; // Ensure this utility is implemented


const Navbar = () => {

  const handleLogout = () => {
    axios
    .post(`${CONFIG.BACKEND_URL}/logout`)
    .then(() => { 
      showAlert('User logout successfully', 'success') 
      window.location.href = '/login';
    })
    .catch((err) => { console.log("Error logging user out:", err) });
  };

  return (
    <nav
      className="navbar navbar-expand-lg bg-primary w-100 px-4 py-3"
      style={{ position: 'sticky', zIndex: '999', top: '0' }}
      data-bs-theme="dark"
    >
      <div className="container-fluid">
        <Link className="navbar-brand" to="#"><img
          src={tcLogo}
          alt="Logo"
          style={{ width: '40px', height: '40px', borderRadius: '50%' }}
        />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarColor01"
          aria-controls="navbarColor01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarColor01">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link active" to="/view">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/employees">Employee Details</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/attendance">Attendance</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/stock">Stock</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/flush">Flush</Link>
            </li>
          </ul>
          <div className="ms-auto">
            <button
              className="btn btn-danger px-4 py-2"
              onClick={handleLogout}
              style={{ fontSize: "16px", borderRadius: "8px", marginTop: "5px" }}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
