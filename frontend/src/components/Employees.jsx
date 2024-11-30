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
  const [salaryDetails, setSalaryDetails] = useState(null);
  const [show, setShow] = useState(false);
  const [newemployee, setNewEmployee] = useState([]);

  useEffect(() => {
    axios
      .get(`${CONFIG.BACKEND_URL}/employees`)
      .then((response) => setEmployees(response.data))
      .catch((error) => console.error('Error fetching stock data:', error));
  }, []);

  const handleShow = (item = null) => {
    if (item) {
      setEditemployee(item); // Set the item to be edited
      console.log(item)
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
        advance: 0
      })
    }
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setEditemployee(null); // Clear edit state
  };

  const handleAddEmployee = () => {
    if (!newemployee.employee_id || !newemployee.name || !newemployee.gender || !newemployee.phone_number || !newemployee.role || !newemployee.date_of_joining || !newemployee.salary || !newemployee.advance) {
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
          role: 0,
          date_of_joining: '',
          salary: 0,
          advance: 0
        });
        showAlert("Added Employee successfully",'success')
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
        showAlert("Edited employee successfully",'success');
        setShow(false);
        setEditemployee(null);
      })
      .catch((error) => console.error('Error updating employee:', error));
  };

  const handleDeleteEmployee = (id) => {
    axios
      .delete(`${CONFIG.BACKEND_URL}/employees/${id}`)
      .then(() => {
        setEmployees(employees.filter((item) => item.employee_id !== id));
        showAlert("Deleted employee successfully",'success')
      })
      .catch((error) => console.error('Error deleting Employee:', error));
  };

  const handleViewSalary = (emp) => {
    setViewSalaryEmployee(emp);
    setSalaryDetails(null);
    setSalaryMonth('');
    setShowSalaryModal(true);
  }

  const handleGetSalary = () => {
    if (!salaryMonth) {
      showAlert('Please enter a valid month.','warning');
      return;
    }
    axios
      .get(`${CONFIG.BACKEND_URL}/salary/${viewSalaryEmployee.employee_id}/${salaryMonth.split('-')[1]}`)
      .then((response) => {
        setSalaryDetails(response.data);
        showAlert('Salary Fetched Successfully','success');
      })
      .catch((err)=> {
        //When the attendance data for the entire month is not present
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
    setShowSalaryModal(false);
  }

  return (
    <div className="container-fluid mt-4 mb-4" >
      <h1 className="text-center mb-4">Employee Details</h1>
      <Button variant="primary" onClick={() => handleShow()}>
        Create Employee
      </Button>
      <Table striped bordered hover className="mt-3">
        <thead style={{ top: '83px', position: 'sticky', zIndex: '999' }}>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Gender</th>
            <th>Phone Number</th>
            <th>Role</th>
            <th>Date Of Joining</th>
            <th>Salary</th>
            <th>Advance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((item) => (
            <tr key={item.employee_id}>
              <td>{item.employee_id}</td>
              <td>{item.name}</td>
              <td>{item.gender}</td>
              <td>{item.phone_number}</td>
              <td>{item.role}</td>
              <td>{item.date_of_joining.split('T')[0]}</td>
              <td>{item.salary}</td>
              <td>{item.advance}</td>
              <td>
                <Button variant="warning" onClick={() => handleShow(item)}>
                  Edit
                </Button>{' '}
                <Button variant="danger" onClick={() => handleDeleteEmployee(item.employee_id)}>
                  Delete
                </Button>
                <Button variant="normal" onClick={() => handleViewSalary(item)}>
                  View Salary
                </Button>
              </td>
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
          <Form.Group controlId="formMonth">
            <Form.Label>Enter Month</Form.Label>
            <Form.Control
              type="month"
              placeholder="YYYY-MM"
              value={salaryMonth}
              onChange={(e) => setSalaryMonth(e.target.value)}
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
            <Form.Group controlId="formgender">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                type="text"
                placeholder="Gender"
                value={editemployee ? editemployee.gender : newemployee.gender}
                onChange={(e) =>
                  editemployee
                    ? setEditemployee({ ...editemployee, gender: e.target.value })
                    : setNewEmployee({ ...newemployee, gender: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formPhoneNo">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Phone Number"
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
                placeholder="Enter Role"
                value={editemployee ? editemployee.role : newemployee.role}
                onChange={(e) =>
                  editemployee
                    ? setEditemployee({ ...editemployee, role: e.target.value })
                    : setNewEmployee({ ...newemployee, role: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formDOJ">
              <Form.Label>Date of Joining</Form.Label>
              <Form.Control
                type="date"
                placeholder="Enter date"
                value={editemployee ? editemployee.date_of_joining : newemployee.date_of_joining}
                onChange={(e) =>
                  editemployee
                    ? setEditemployee({ ...editemployee, date_of_joining: e.target.value })
                    : setNewEmployee({ ...newemployee, date_of_joining: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId='formSalary'>
              <Form.Label>Salary</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter salary of the employee"
                value={editemployee ? editemployee.salary : newemployee.salary}
                onChange={(e) =>
                  editemployee
                    ? setEditemployee({ ...editemployee, salary: e.target.value })
                    : setNewEmployee({ ...newemployee, salary: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId='formAdvance'>
              <Form.Label>Advance</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter advance of the employee"
                value={editemployee ? editemployee.advance : newemployee.advance}
                onChange={(e) =>
                  editemployee
                    ? setEditemployee({ ...editemployee, advance: e.target.value })
                    : setNewEmployee({ ...newemployee, advance: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId='formAadhar'>
              <Form.Label>Aadhar Number</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter aadhar number of the employee"
                value={editemployee ? editemployee.aadhar_number : newemployee.aadhar_number}
                onChange={(e) =>
                  editemployee
                    ? setEditemployee({ ...editemployee, aadhar_number: e.target.value })
                    : setNewEmployee({ ...newemployee, aadhar_number: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId='formAddress'>
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter address of the employee"
                value={editemployee ? editemployee.address : newemployee.address}
                onChange={(e) =>
                  editemployee
                    ? setEditemployee({ ...editemployee, address: e.target.value })
                    : setNewEmployee({ ...newemployee, address: e.target.value })
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
export default Employees