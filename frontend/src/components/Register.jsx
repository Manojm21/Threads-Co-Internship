import { useState } from 'react';
import axios from 'axios';
import 'bootswatch/dist/lux/bootstrap.min.css';
import tcLogo from '../assets/Threads And Co.png';
import CONFIG from '../config'; // Import configuration file

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post(`${CONFIG.BACKEND_URL}/register`, {
        email,
        password,
      });
      console.log(response.data.msg);

      // Redirect to login page on successful registration
      window.location.href = '/login';
    } catch (err) {
      const errorMsg =
        err.response && err.response.data && err.response.data.msg
          ? err.response.data.msg
          : 'Something went wrong. Please try again.';
      setError(errorMsg);
    }
  };

  return (
    <div>
      {/* Logo */}
      <img
        src={tcLogo}
        alt="TC Logo"
        style={{ position: 'absolute', top: '10px', left: '10px', width: '130px' }}
      />

      {/* Registration Form */}
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card p-4 shadow" style={{ maxWidth: '500px', width: '100%' }}>
          <h2 className="text-center mb-4">Register</h2>
          <form>
            {/* Email Input */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Register Button */}
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={handleRegister}
            >
              Register
            </button>

            {/* Error Alert */}
            {error && (
              <div className="alert alert-danger mt-3" role="alert">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
