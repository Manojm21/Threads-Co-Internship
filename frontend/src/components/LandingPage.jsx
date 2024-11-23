import React from "react";
import { useNavigate } from "react-router-dom";


const LandingPage = () => {

    // Unified navigation handler
    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="vh-100  d-flex flex-column align-items-center">

            {/* Main Content */}
            <div className="text-center mt-5 pt-5 w-100">
                <h1 className="mb-3" style={{ fontWeight: "bold", fontSize: "2.5rem" }}>
                    Welcome to Threads & Co!
                </h1>
                <p style={{ fontSize: "1.2rem", color: "#555" }}>
                    Manage your staff and stocks efficiently.
                </p>
            </div>

            {/* Cards Row */}
            <div className="row mt-4 d-flex justify-content-center" style={{ width: "90%" }}>
                {/* Staff Card */}
                <div className="col-md-4 d-flex justify-content-center">
                    <div
                        className="card text-center shadow"
                        onClick={() => handleNavigation("/employees")}
                        style={{
                            cursor: "pointer",
                            width: "280px",
                            height: "180px",
                            padding: "20px",
                            borderRadius: "12px",
                            backgroundColor: "#f8f9fa",
                            marginRight: "15px",
                        }}
                    >
                        <div className="card-body d-flex flex-column justify-content-center align-items-center">
                            <h5 className="card-title" style={{ fontSize: "1.5rem", fontWeight: "600" }}>Staff</h5>
                            <p className="card-text" style={{ fontSize: "1rem", color: "#666" }}>
                                View and manage all employees.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stocks Card */}
                <div className="col-md-4 d-flex justify-content-center">
                    <div
                        className="card text-center shadow"
                        onClick={() => handleNavigation("/stock")}
                        style={{
                            cursor: "pointer",
                            width: "280px",
                            height: "180px",
                            padding: "20px",
                            borderRadius: "12px",
                            backgroundColor: "#f8f9fa",
                            marginLeft: "15px",
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

                {/* Attendance Card */}
                <div className="col-md-4 d-flex justify-content-center">
                    <div
                        className="card text-center shadow"
                        onClick={() => handleNavigation("/attendance")}
                        style={{
                            cursor: "pointer",
                            width: "280px",
                            height: "180px",
                            padding: "20px",
                            borderRadius: "12px",
                            backgroundColor: "#f8f9fa",
                        }}
                    >
                        <div className="card-body d-flex flex-column justify-content-center align-items-center">
                            <h5 className="card-title" style={{ fontSize: "1.5rem", fontWeight: "600" }}>Attendance</h5>
                            <p className="card-text" style={{ fontSize: "1rem", color: "#666" }}>
                                Monitor and update Employee Attendance.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
