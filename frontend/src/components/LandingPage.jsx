import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    const navigate = useNavigate();

    const handleNavigation1 = () => {
        navigate("/stock"); // Navigate to the provided path
    };
    const handleNavigation2 = () => {
        navigate("/employees"); // Navigate to the provided path
    };

    const handleLogout = () => {
        // Add your logout logic here, such as clearing user data, redirecting, etc.
        navigate("/login"); // Assuming the login page is at "/login"
    };

    return (
        <div className="container-fluid d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
            {/* Logout Button */}
            <div className="position-absolute top-0 end-0 m-4">
                <button 
                    className="btn btn-danger px-4 py-2" 
                    onClick={handleLogout}
                    style={{ fontSize: "16px", borderRadius: "8px" }}
                >
                    Logout
                </button>
            </div>

            <h1 className="mb-3 text-center" style={{ fontWeight: "bold", fontSize: "2.5rem" }}>
                Welcome to Threads & Co!
            </h1>
            <p className="text-center mb-5" style={{ fontSize: "1.2rem", color: "#555" }}>
                Manage your staff and stocks efficiently.
            </p>
            
            <div className="d-flex justify-content-center align-items-center" style={{ width: "100%" }}>
                {/* Staff Card */}
                <div
                    className="card text-center shadow mx-3"
                    onClick={() => handleNavigation2("/employees")}
                    style={{
                        cursor: "pointer",
                        width: "300px",
                        height: "180px",
                        padding: "20px",
                        borderRadius: "12px",
                        backgroundColor: "#f8f9fa"
                    }}
                >
                    <div className="card-body d-flex flex-column justify-content-center align-items-center">
                        <h5 className="card-title" style={{ fontSize: "1.5rem", fontWeight: "600" }}>Staff</h5>
                        <p className="card-text" style={{ fontSize: "1rem", color: "#666" }}>
                            View and manage all employees.
                        </p>
                    </div>
                </div>

                {/* Stocks Card */}
                <div
                    className="card text-center shadow mx-3"
                    onClick={() => handleNavigation1("/stock")}
                    style={{
                        cursor: "pointer",
                        width: "300px",
                        height: "180px",
                        padding: "20px",
                        borderRadius: "12px",
                        backgroundColor: "#f8f9fa"
                    }}
                >
                    <div className="card-body d-flex flex-column justify-content-center align-items-center">
                        <h5 className="card-title" style={{ fontSize: "1.5rem", fontWeight: "600" }}>Stocks</h5>
                        <p className="card-text" style={{ fontSize: "1rem", color: "#666" }}>
                            Monitor and update inventory details.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
