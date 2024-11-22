import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import CONFIG from '../config'; // Ensure CONFIG.BACKEND_URL is defined

const Stock = () => {
  const [stockData, setStockData] = useState([]);
  const [show, setShow] = useState(false);
  const [editItem, setEditItem] = useState(null); // Tracks item being edited
  const [newItem, setNewItem] = useState({
    id: '',
    name: '',
    colour: '',
    total_quantity: 0,
    balance_quantity: 0,
    Rack_no: '',
    Size: ''
  });

  // Fetch all stock items on component mount
  useEffect(() => {
    axios
      .get(`${CONFIG.BACKEND_URL}/stock`)
      .then((response) => setStockData(response.data))
      .catch((error) => console.error('Error fetching stock data:', error));
  }, []);

  // Add a new stock item
  const handleAddItem = () => {
    if (!newItem.id || !newItem.name || !newItem.colour || newItem.total_quantity <= 0) {
      alert('Please fill in all fields correctly.');
      return;
    }

    axios
      .post(`${CONFIG.BACKEND_URL}/stock`, newItem)
      .then(() => {
        setStockData([...stockData, newItem]); // Update state with the new item
        setNewItem({
          id: '',
          name: '',
          colour: '',
          total_quantity: 0,
          balance_quantity: 0,
          Rack_no: '',
          Size: ''
        });
        setShow(false);
      })
      .catch((error) => console.error('Error adding item:', error));
  };

  // Update an existing stock item
  const handleEditItem = () => {
    axios
      .put(`${CONFIG.BACKEND_URL}/stock/${editItem.id}`, editItem)
      .then(() => {
        setStockData((prev) =>
          prev.map((item) => (item.id === editItem.id ? { ...editItem } : item))
        );
        setShow(false);
        setEditItem(null);
      })
      .catch((error) => console.error('Error updating item:', error));
  };

  // Delete a stock item
  const handleDeleteItem = (id) => {
    axios
      .delete(`${CONFIG.BACKEND_URL}/stock/${id}`)
      .then(() => {
        setStockData(stockData.filter((item) => item.id !== id));
      })
      .catch((error) => console.error('Error deleting item:', error));
  };

  // Open modal for adding or editing stock
  const handleShow = (item = null) => {
    if (item) {
      setEditItem(item); // Set the item to be edited
    } else {
      setNewItem({
        id: '',
        name: '',
        colour: '',
        total_quantity: 0,
        balance_quantity: 0,
        Rack_no: '',
        Size: ''
      });
    }
    setShow(true);
  };

  // Close modal
  const handleClose = () => {
    setShow(false);
    setEditItem(null); // Clear edit state
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Stock Management</h1>
      <Button variant="primary" onClick={() => handleShow()}>
        Add New Item
      </Button>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Colour</th>
            <th>Total Quantity</th>
            <th>Balance Quantity</th>
            <th>Rack No</th>
            <th>Size</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stockData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.colour}</td>
              <td>{item.total_quantity}</td>
              <td>{item.balance_quantity}</td>
              <td>{item.Rack_no}</td>
              <td>{item.Size}</td>
              <td>
                <Button variant="warning" onClick={() => handleShow(item)}>
                  Edit
                </Button>{' '}
                <Button variant="danger" onClick={() => handleDeleteItem(item.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Add/Edit Item */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editItem ? 'Edit Item' : 'Add New Item'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formId">
              <Form.Label>Item ID</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter item ID"
                value={editItem ? editItem.id : newItem.id}
                onChange={(e) =>
                  editItem
                    ? setEditItem({ ...editItem, id: e.target.value })
                    : setNewItem({ ...newItem, id: e.target.value })
                }
                disabled={!!editItem} // Disable ID field in edit mode
              />
            </Form.Group>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter item name"
                value={editItem ? editItem.name : newItem.name}
                onChange={(e) =>
                  editItem
                    ? setEditItem({ ...editItem, name: e.target.value })
                    : setNewItem({ ...newItem, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formColour">
              <Form.Label>Colour</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter item colour"
                value={editItem ? editItem.colour : newItem.colour}
                onChange={(e) =>
                  editItem
                    ? setEditItem({ ...editItem, colour: e.target.value })
                    : setNewItem({ ...newItem, colour: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formTotalQuantity">
              <Form.Label>Total Quantity</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter total quantity"
                value={editItem ? editItem.total_quantity : newItem.total_quantity}
                onChange={(e) =>
                  editItem
                    ? setEditItem({ ...editItem, total_quantity: e.target.value })
                    : setNewItem({ ...newItem, total_quantity: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formBalanceQuantity">
              <Form.Label>Balance Quantity</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter balance quantity"
                value={editItem ? editItem.balance_quantity : newItem.balance_quantity}
                onChange={(e) =>
                  editItem
                    ? setEditItem({ ...editItem, balance_quantity: e.target.value })
                    : setNewItem({ ...newItem, balance_quantity: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formRackNo">
              <Form.Label>Rack No</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter rack number"
                value={editItem ? editItem.Rack_no : newItem.Rack_no}
                onChange={(e) =>
                  editItem
                    ? setEditItem({ ...editItem, Rack_no: e.target.value })
                    : setNewItem({ ...newItem, Rack_no: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formSize">
              <Form.Label>Size</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter size of the item"
                value={editItem ? editItem.Size : newItem.Size}
                onChange={(e) =>
                  editItem
                    ? setEditItem({ ...editItem, Size: e.target.value })
                    : setNewItem({ ...newItem, Size: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={editItem ? handleEditItem : handleAddItem}>
            {editItem ? 'Update Item' : 'Add Item'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Stock;
