import { useContext, useState } from 'react';
import axios from 'axios';
import 'bootswatch/dist/lux/bootstrap.min.css';
import tcLogo from '../assets/Threads And Co.png';
import AuthApi from '../utils/AuthApi';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const authApi = useContext(AuthApi);
  const navigate = useNavigate();

  const handleLogin = async () => {
    
    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });
      console.log(response.data.msg);
      authApi.setAuth(true);
      navigate("/view") ////to be changed
    } catch (error) {
      // setError(error.response.data.msg);
      console.log(error)
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      {/* Left Logo */}
      <img src={tcLogo} alt="TC Logo" style={{ position: 'absolute', top: '10px', left: '10px', width: '130px' }} />
      
      <div className="card p-4 shadow" style={{ maxWidth: '500px', width: '100%' }}>
        <h2 className="text-center mb-4">Login</h2>
        <form>
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
            />
          </div>
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
            />
          </div>
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={handleLogin}
          >
            Login
          </button>
          {error && (
            <div className="alert alert-danger mt-3" role="alert">
              {error}
            </div>
          )}
        </form>
      </div>

      
    </div>
  );
};

export default Login;