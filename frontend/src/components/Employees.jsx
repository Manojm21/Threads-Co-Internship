import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import CONFIG from '../config'; // Ensure CONFIG.BACKEND_URL is defined
import { showAlert } from '../utils/alertUtils'; // Ensure this utility is implemented

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [editemployee, setEditemployee] = useState(null);
  const [viewSalaryEmployee, setViewSalaryEmployee] = useState('');
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [salaryMonth, setSalaryMonth] = useState('');
  const [salaryYear, setSalaryYear] = useState('');
  const [salaryDetails, setSalaryDetails] = useState(null);
  const [show, setShow] = useState(false);
  const [newemployee, setNewEmployee] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query
  const [isExpanded, setIsExpanded] = useState(false); // State for managing table expansion

  useEffect(() => {
    axios
      .get(`${CONFIG.BACKEND_URL}/employees`)
      .then((response) => setEmployees(response.data))
      .catch((error) => console.error('Error fetching employee data:', error));
  }, []);

  // Filter employees based on search query (includes employee_id, name, gender, role)
  const filteredEmployees = employees.filter((item) => {
    return (
      item.employee_id.toString().includes(searchQuery) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.gender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleShow = (item = null) => {
    if (item) {
      setEditemployee(item); // Set the item to be edited
    }
    else {
      setNewEmployee({
        employee_id: '',
        name: '',
        gender: '',
        phone_number: 0,
        role: '',
        date_of_joining: '',
        salary: 0,
        advance: 0,
        notes: '' // Add notes field here for new employees
      })
    }
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setEditemployee(null); // Clear edit state
  };

  const handleAddEmployee = () => {
    if (!newemployee.employee_id || !newemployee.name || !newemployee.gender || !newemployee.phone_number || !newemployee.role || !newemployee.date_of_joining || !newemployee.salary || !newemployee.advance || !newemployee.notes) {
      showAlert('Please fill in all fields correctly.','warning');
      return;
    }

    axios
      .post(`${CONFIG.BACKEND_URL}/employees`, newemployee)
      .then(() => {
        setEmployees([...employees, newemployee]); // Update state with the new item
        setNewEmployee({
          employee_id: '',
          name: '',
          gender: '',
          phone_number: 0,
          role: '',
          date_of_joining: '',
          salary: 0,
          advance: 0,
          notes: '' // Reset notes field
        });
        showAlert("Added Employee successfully",'success');
        setShow(false);
      })
      .catch((error) => console.error('Error adding employee:', error));
  };

  const handleEditEmployee = () => {
    axios
      .put(`${CONFIG.BACKEND_URL}/employees/${editemployee.employee_id}`, editemployee)
      .then(() => {
        setEmployees((prev) =>
          prev.map((item) => (item.employee_id === editemployee.employee_id ? { ...editemployee } : item))
        );
        
        setEditemployee(null);
        setShow(false);
      })
      .catch((error) => console.error('Error updating employee:', error));
  };

  const handleDeleteEmployee = (id) => {
    axios
      .delete(`${CONFIG.BACKEND_URL}/employees/${id}`)
      .then(() => {
        setEmployees(employees.filter((item) => item.employee_id !== id));
        // showAlert("Deleted employee successfully",'success')
      })
      .catch((error) => console.error('Error deleting Employee:', error));
  };

  const handleViewSalary = (emp) => {
    setViewSalaryEmployee(emp);
    setSalaryDetails(null);
    setSalaryMonth('');
    setSalaryYear('');
    setShowSalaryModal(true);
  }

  const handleGetSalary = () => {
    if (!salaryMonth || !salaryYear) {
      showAlert('Please enter a valid month and year','warning');
      return;
    }
    axios
      .get(`${CONFIG.BACKEND_URL}/salary/${viewSalaryEmployee.employee_id}/${salaryMonth}/${salaryYear}`)
      .then((response) => {
        setSalaryDetails(response.data);
        // showAlert('Salary Fetched Successfully','success');
      })
      .catch((err)=> {
        if(err.response.status == 400){
          showAlert("The attendance of the employee for the entire month is not available");
          return;
        }
        console.log("Error fetching salary: ", err);
        showAlert('Failed to fetch the salary of the employee','error');
      })
  }

  const handleCloseSalaryModal = () => {
    setSalaryDetails(null);
    setSalaryMonth('');
    setSalaryYear('');
    setShowSalaryModal(false);
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleTableExpansion = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="container-fluid mt-4 mb-4">
      <h1 className="text-center mb-4">Employee Details</h1>

      {/* Search Input */}
      <Form.Control
        type="text"
        placeholder="Search by Employee ID, Name, Gender, or Role"
        value={searchQuery}
        onChange={handleSearchChange}
        style={{ width: '300px', marginBottom: '20px' }}
      />

<div className="d-flex justify-content-between mb-3">
  {/* Left-aligned Create Employee Button */}
  <Button variant="primary" onClick={() => handleShow()}>
    Create Employee
  </Button>

  {/* Right-aligned Toggle Button */}
  <Button variant="success" onClick={toggleTableExpansion}>
    {isExpanded ? "View Less" : "View More"}
  </Button>
</div>


      <Table striped bordered hover className="mt-3">
        <thead style={{ top: '83px', position: 'sticky', zIndex: '999' }}>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Gender</th>
            <th>Role</th>
            <th>Salary & Advance</th>
            <th>Actions</th>
                       
            {isExpanded && (
              <>
              
              <th>Phone Number</th>
              <th>Date Of Joining</th>
              <th>Notes</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((item) => (
            <tr key={item.employee_id}>
              <td>{item.employee_id}</td>
              <td>{item.name}</td>
              <td>{item.gender}</td>
              <td>{item.role}</td>
              <td>
  <div>Salary: Rs {item.salary}</div>
  <div>Advance: Rs {item.advance}</div>
</td>

                  <td>
                    <Button variant="warning" onClick={() => handleShow(item)}>
                      Edit
                    </Button>{' '}
                    <Button variant="danger" onClick={() => handleDeleteEmployee(item.employee_id)}>
                      Delete
                    </Button>{' '}
                    <Button variant="info" onClick={() => handleViewSalary(item)}>
                      View Salary
                    </Button>
                  </td>
              {isExpanded && (
                <>
                <td>{item.phone_number}</td>
                <td>{item.date_of_joining.split('T')[0]}</td>
                <td>{item.notes}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Salary */}
      <Modal show={showSalaryModal} onHide={() => handleCloseSalaryModal()}>
        <Modal.Header closeButton>
          <Modal.Title>{viewSalaryEmployee.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formMonth" style={{marginBottom : '20px'}}>
            <Form.Label>Enter Month</Form.Label>
            <Form.Control
              type="text"
              placeholder="MM"
              value={salaryMonth}
              onChange={(e) => setSalaryMonth(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId = "formYear">
            <Form.Control
              type = "text"
              placeholder= "YYYY"
              value={salaryYear}
              onChange={(e) => setSalaryYear(e.target.value)}
            />
          </Form.Group>
          {salaryDetails && (
            <div className="mt-3">
              <h5>Salary Details</h5>
              <p><strong>Per Month Salary: Rs</strong> {salaryDetails['payableSalary']}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSalaryModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleGetSalary}>
            Get Salary
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Add/Edit Item */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editemployee ? 'Edit Employee Details' : 'Add New Employee'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formId">
              <Form.Label>Employee ID</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Employee ID"
                value={editemployee ? editemployee.employee_id : newemployee.employee_id}
                onChange={(e) =>
                  editemployee ? setEditemployee({ ...editemployee, employee_id: e.target.value })
                    : setNewEmployee({ ...newemployee, employee_id: e.target.value })
                }
                disabled={editemployee} // Disable ID field in edit mode
              />
            </Form.Group>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter employee name"
                value={editemployee ? editemployee.name : newemployee.name}
                onChange={(e) =>
                  editemployee
                    ? setEditemployee({ ...editemployee, name: e.target.value })
                    : setNewEmployee({ ...newemployee, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formGender">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter employee gender"
                value={editemployee ? editemployee.gender : newemployee.gender}
                onChange={(e) =>
                  editemployee
                    ? setEditemployee({ ...editemployee, gender: e.target.value })
                    : setNewEmployee({ ...newemployee, gender: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formPhone">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter employee phone number"
                value={editemployee ? editemployee.phone_number : newemployee.phone_number}
                onChange={(e) =>
                  editemployee
                    ? setEditemployee({ ...editemployee, phone_number: e.target.value })
                    : setNewEmployee({ ...newemployee, phone_number: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formRole">
              <Form.Label>Role</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter employee role"
                value={editemployee ? editemployee.role : newemployee.role}
                onChange={(e) =>
                  editemployee
                    ? setEditemployee({ ...editemployee, role: e.target.value })
                    : setNewEmployee({ ...newemployee, role: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formDOJ">
              <Form.Label>Date Of Joining</Form.Label>
              <Form.Control
                type="date"
                placeholder="Enter date of joining"
                value={editemployee ? editemployee.date_of_joining.split('T')[0] : newemployee.date_of_joining}
                onChange={(e) =>
                  editemployee
                    ? setEditemployee({ ...editemployee, date_of_joining: e.target.value })
                    : setNewEmployee({ ...newemployee, date_of_joining: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formSalary">
              <Form.Label>Salary</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter salary"
                value={editemployee ? editemployee.salary : newemployee.salary}
                onChange={(e) =>
                  editemployee
                    ? setEditemployee({ ...editemployee, salary: e.target.value })
                    : setNewEmployee({ ...newemployee, salary: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formAdvance">
              <Form.Label>Advance</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter advance"
                value={editemployee ? editemployee.advance : newemployee.advance}
                onChange={(e) =>
                  editemployee
                    ? setEditemployee({ ...editemployee, advance: e.target.value })
                    : setNewEmployee({ ...newemployee, advance: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formNotes">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter any notes for the employee"
                value={editemployee ? editemployee.notes : newemployee.notes}
                onChange={(e) =>
                  editemployee
                    ? setEditemployee({ ...editemployee, notes: e.target.value })
                    : setNewEmployee({ ...newemployee, notes: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={editemployee ? handleEditEmployee : handleAddEmployee}>
            {editemployee ? 'Update Employee' : 'Add Employee'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Employees;
