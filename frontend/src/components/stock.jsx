import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CONFIG from './config'; // Import the configuration file

const Stock = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    id: '',
    name: '',
    colour: '',
    total_quantity: '',
    balance_quantity: '',
    Rack_no: '',
  });
  const [quantityChange, setQuantityChange] = useState({
    id: '',
    flag: '', // '1' for increase, '0' for decrease
    qty: '',
  });
  const [error, setError] = useState('');

  // Fetch stock items from the backend
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${CONFIG.BACKEND_URL}/stock`);
        setItems(response.data);
      } catch (err) {
        setError('Failed to fetch items');
      }
    };
    fetchItems();
  }, []);

  // Handle adding a new stock item
  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${CONFIG.BACKEND_URL}/stock`, newItem);
      setNewItem({
        id: '',
        name: '',
        colour: '',
        total_quantity: '',
        balance_quantity: '',
        Rack_no: '',
      });
      // Refresh the list after adding a new item
      const response = await axios.get(`${CONFIG.BACKEND_URL}/stock`);
      setItems(response.data);
    } catch (err) {
      setError('Failed to add item');
    }
  };

  // Handle deleting a stock item
  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`${CONFIG.BACKEND_URL}/stock/${id}`);
      // Refresh the list after deleting an item
      const response = await axios.get(`${CONFIG.BACKEND_URL}/stock`);
      setItems(response.data);
    } catch (err) {
      setError('Failed to delete item');
    }
  };

  // Handle updating the stock quantity
  const handleUpdateQuantity = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${CONFIG.BACKEND_URL}/stock/${quantityChange.id}/${quantityChange.flag}/${quantityChange.qty}`);
      setQuantityChange({ id: '', flag: '', qty: '' });
      // Refresh the list after updating stock
      const response = await axios.get(`${CONFIG.BACKEND_URL}/stock`);
      setItems(response.data);
    } catch (err) {
      setError('Failed to update stock');
    }
  };

  return (
    <div>
      <h1>Stock Management</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <h2>Add New Item</h2>
        <form onSubmit={handleAddItem}>
          <input
            type="number"
            placeholder="ID"
            value={newItem.id}
            onChange={(e) => setNewItem({ ...newItem, id: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Colour"
            value={newItem.colour}
            onChange={(e) => setNewItem({ ...newItem, colour: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Total Quantity"
            value={newItem.total_quantity}
            onChange={(e) => setNewItem({ ...newItem, total_quantity: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Balance Quantity"
            value={newItem.balance_quantity}
            onChange={(e) => setNewItem({ ...newItem, balance_quantity: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Rack No"
            value={newItem.Rack_no}
            onChange={(e) => setNewItem({ ...newItem, Rack_no: e.target.value })}
          />
          <button type="submit">Add Item</button>
        </form>
      </div>

      <div>
        <h2>Update Stock Quantity</h2>
        <form onSubmit={handleUpdateQuantity}>
          <input
            type="number"
            placeholder="Item ID"
            value={quantityChange.id}
            onChange={(e) => setQuantityChange({ ...quantityChange, id: e.target.value })}
            required
          />
          <select
            value={quantityChange.flag}
            onChange={(e) => setQuantityChange({ ...quantityChange, flag: e.target.value })}
            required
          >
            <option value="">Select Operation</option>
            <option value="1">Increase</option>
            <option value="0">Decrease</option>
          </select>
          <input
            type="number"
            placeholder="Quantity"
            value={quantityChange.qty}
            onChange={(e) => setQuantityChange({ ...quantityChange, qty: e.target.value })}
            required
          />
          <button type="submit">Update Quantity</button>
        </form>
      </div>

      <div>
        <h2>Stock Items</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Colour</th>
              <th>Total Quantity</th>
              <th>Balance Quantity</th>
              <th>Rack No</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.colour}</td>
                <td>{item.total_quantity}</td>
                <td>{item.balance_quantity}</td>
                <td>{item.Rack_no}</td>
                <td>
                  <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Stock;
