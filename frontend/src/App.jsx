import 'bootswatch/dist/lux/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login'
import Register from './components/Register'
import AuthApi from './utils/AuthApi';
import { useContext, useState } from 'react';
import LandingPage from './components/LandingPage';


const App = () => {
  const [auth, setAuth] = useState(false);
  return (
    <AuthApi.Provider value={{auth, setAuth}}>
      <Router>
        <div className="container mt-5">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/view" element={<RouteProtection><LandingPage /></RouteProtection>} />
            <Route path="/" element={<Dashboard/>} />

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