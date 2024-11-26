import React, { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';

const AutoDismissAlert = ({ variant = 'info', message, duration = 3000, onClose }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      if (onClose) onClose(); // Call onClose callback if provided
    }, duration);

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [duration, onClose]);

  if (!show) return null;

  return (
    <Alert variant={variant} onClose={() => setShow(false)} dismissible>
      {message}
    </Alert>
  );
};

export default AutoDismissAlert;
