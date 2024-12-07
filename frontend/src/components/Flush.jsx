import React from 'react';
import axios from 'axios';
import { Button, Alert } from 'react-bootstrap';
import CONFIG from '../config'; // Ensure this file contains the correct backend URL
import { FaExclamationTriangle } from 'react-icons/fa'; // You can install react-icons to get the warning symbol

const Flush = () => {
  // Function to handle cleanup of old records
  const handleCleanup = () => {
    axios
      .delete(`${CONFIG.BACKEND_URL}/flush`)
      .then((response) => {
        alert('Old records deleted successfully');
      })
      .catch((error) => {
        console.error('Error cleaning up records:', error);
        alert('Failed to delete old records');
      });
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100">
      <Alert variant="warning" className="text-center mb-4" style={{ maxWidth: '500px' }}>
        <FaExclamationTriangle className="mr-2" />
        Warning: The previous data will be deleted permanently. Proceed with caution.
      </Alert>
      <Button variant="danger" size="lg" onClick={handleCleanup} className="text-center">
        Clean Up Old Records
      </Button>
    </div>
  );
};

export default Flush;
