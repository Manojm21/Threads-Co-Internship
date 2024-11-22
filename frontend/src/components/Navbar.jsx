import React from 'react';
import { Link } from 'react-router-dom';
import tcLogo from '../assets/image.png';

const Navbar = () => {
  return (
    <nav
      className="navbar navbar-expand-lg bg-primary"
      data-bs-theme="dark"
      style={{ padding: '0.75rem 1rem' }} // Adjust the padding here
    >
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Navbar</Link>
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
          </ul>
          <div className="ms-auto">
            <img
              src={tcLogo}
              alt="Logo"
              style={{ width: '40px', height: '40px', borderRadius: '50%' }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
