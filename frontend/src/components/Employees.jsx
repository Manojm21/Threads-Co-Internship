import './styles.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CONFIG from '../config';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc'); // asc or desc

  // Fetch employees from the backend
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${CONFIG.BACKEND_URL}/employees`);
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle search
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter employees based on search query
  const filteredEmployees = employees.filter(employee => {
    return Object.values(employee).some(val =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Handle sorting by column
  const handleSort = (column) => {
    const order = sortedColumn === column && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortedColumn(column);
    setSortOrder(order);

    const sortedData = [...filteredEmployees].sort((a, b) => {
      if (a[column] < b[column]) return order === 'asc' ? -1 : 1;
      if (a[column] > b[column]) return order === 'asc' ? 1 : -1;
      return 0;
    });

    setEmployees(sortedData);
  };

  // Handle increment/decrement of salary
  const handleSalaryChange = async (employeeId, change) => {
    try {
      const employee = employees.find(emp => emp.employee_id === employeeId);
      const updatedSalary = employee.salary + change;

      await axios.put(`${CONFIG.BACKEND_URL}/employees/${employeeId}`, { salary: updatedSalary });
      fetchEmployees(); // Re-fetch after updating salary
    } catch (error) {
      console.error('Error updating salary:', error);
    }
  };

  return (
    <div>
      <h1>Employee Management</h1>
      <input
        type="text"
        placeholder="Search employees"
        value={searchQuery}
        onChange={handleSearch}
      />
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>Name</th>
            <th onClick={() => handleSort('role')}>Role</th>
            <th onClick={() => handleSort('salary')}>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee) => (
            <tr key={employee.employee_id}>
              <td>{employee.name}</td>
              <td>{employee.role}</td>
              <td>{employee.salary}</td>
              <td>
                <button onClick={() => handleSalaryChange(employee.employee_id, 100)}>Increase Salary</button>
                <button onClick={() => handleSalaryChange(employee.employee_id, -100)}>Decrease Salary</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Employees;
