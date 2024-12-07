import 'bootswatch/dist/lux/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar'; // Import the Navbar
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import Stock from './components/Stocks';
import Employees from './components/Employees'; 
import Attendance from './components/Attendance';
import Flush from './components/Flush';
import AuthApi from './utils/AuthApi';
import { useContext, useState } from 'react';
import LandingPage from './components/LandingPage';

const App = () => {
  const [auth, setAuth] = useState(false);
  return (
    <AuthApi.Provider value={{ auth, setAuth }}>
      <Router>
        <div className="container-fluid" style={{'padding':'0'}}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/view" element={<RouteProtection><Navbar/><LandingPage /></RouteProtection>} />
            <Route path="/stock" element={<RouteProtection><Navbar/><Stock /></RouteProtection>} />
            <Route path="/employees" element={<RouteProtection><Navbar/><Employees /></RouteProtection>} />
            <Route path="/attendance" element={<RouteProtection><Navbar/><Attendance /></RouteProtection>} />
            <Route path="/flush" element={<RouteProtection><Navbar/><Flush/></RouteProtection>}/>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </AuthApi.Provider>
  );
};

const RouteProtection = ({ children }) => {
  const authApi = useContext(AuthApi);
  return authApi.auth ? children : <Navigate to="/login" />;
};

export default App;
