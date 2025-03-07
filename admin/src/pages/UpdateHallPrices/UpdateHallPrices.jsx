import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { url } from '../../App';
import './UpdateHallPrices.css'; // Import the CSS file

const UpdateHallPrices = () => {
  const [eventType, setEventType] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [currentPrices, setCurrentPrices] = useState({});

  useEffect(() => {
    // Fetch the current prices when the component mounts
    const fetchCurrentPrices = async () => {
      try {
        const response = await axios.get(`${url}/api/hall/prices`);
        if (response.data.success) {
          const prices = response.data.prices;
          setCurrentPrices(prices);
          localStorage.setItem('prices', JSON.stringify(prices)); // Store the prices in local storage
        } else {
          toast.error('Error fetching current prices.');
        }
      } catch (error) {
        console.error('Error fetching current prices:', error);
        toast.error('Error fetching current prices.');
      }
    };

    // Check if the prices are already stored in local storage
    const storedPrices = localStorage.getItem('prices');
    if (storedPrices) {
      setCurrentPrices(JSON.parse(storedPrices));
    } else {
      fetchCurrentPrices();
    }
  }, []);

  // Function to handle the price change
  const handleChangePrice = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(`${url}/api/hall/update-prices`, { eventType, newPrice });
      if (response.data.success) {
        toast.success('Price changed successfully!');
        setCurrentPrices({ ...currentPrices, [eventType]: newPrice }); // Update the current prices
        localStorage.setItem('prices', JSON.stringify({ ...currentPrices, [eventType]: newPrice })); // Store the new prices in local storage
      } else {
        toast.error('Error changing price.');
      }
    } catch (error) {
      console.error('Error changing price:', error);
      toast.error('Error changing price.');
    }
  };

  const formatPrice = (value) => {
    return `₦${value.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="update-hall-prices-container">
      <h2>Update Hall Prices</h2>
      <div className="current-prices">
        <strong>Current Prices:</strong>
        <ul>
          {Object.entries(currentPrices).map(([event, price]) => (
            <li key={event}>{event}: {formatPrice(price)}</li>
          ))}
        </ul>
      </div>
      <form onSubmit={handleChangePrice}>
        <div>
          <label>Event Type:</label>
          <select value={eventType} onChange={(e) => setEventType(e.target.value)} required>
            <option value="">Select Event Type</option>
            <option value="Wedding">Wedding</option>
            <option value="Graduation">Graduation</option>
            <option value="Birthday Party">Birthday Party</option>
            <option value="Conference">Conference</option>
            <option value="Meetings">Meetings</option>
            <option value="Workshop">Workshop</option>
            <option value="Seminar">Seminar</option>
          </select>
        </div>
        <div>
          <label>New Price (₦):</label>
          <input
            type="number"
            value={newPrice}
            onChange={(e) => setNewPrice(Number(e.target.value))} // Ensure the value is a number
            placeholder="Enter new price in Naira"
            required
          />
        </div>
        <button type="submit">Update Price</button>
      </form>
    </div>
  );
};

export default UpdateHallPrices;
