import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { url } from '../../App';
import './DeliveryFee.css'; // Import the CSS file

const ChangeDeliveryFee = () => {
  const [deliveryFee, setDeliveryFee] = useState(''); // Initialize as an empty string
  const [currentDeliveryFee, setCurrentDeliveryFee] = useState(0);

  useEffect(() => {
    // Fetch the current delivery fee when the component mounts
    const fetchCurrentDeliveryFee = async () => {
      try {
        const response = await axios.get(`${url}/api/admin/delivery-fee`);
        if (response.data.success) {
          const fee = response.data.deliveryFee;
          setCurrentDeliveryFee(fee);
          localStorage.setItem('deliveryFee', fee); // Store the delivery fee in local storage
          console.log('Fetched delivery fee from API:', fee);
        } else {
          toast.error('Error fetching current delivery fee.');
        }
      } catch (error) {
        console.error('Error fetching current delivery fee:', error);
        toast.error('Error fetching current delivery fee.');
      }
    };

    // Check if the delivery fee is already stored in local storage
    const storedDeliveryFee = localStorage.getItem('deliveryFee');
    if (storedDeliveryFee) {
      setCurrentDeliveryFee(Number(storedDeliveryFee));
      console.log('Fetched delivery fee from localStorage:', storedDeliveryFee);
    } else {
      fetchCurrentDeliveryFee();
    }
  }, []);

  // Function to handle the delivery fee change
  const handleChangeDeliveryFee = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${url}/api/admin/change-delivery-fee`, {
        deliveryFee: Number(deliveryFee),
        date: new Date()
      });
      if (response.data.success) {
        toast.success('Delivery fee changed successfully!');
        setCurrentDeliveryFee(Number(deliveryFee)); // Update the current delivery fee
        localStorage.setItem('deliveryFee', Number(deliveryFee)); // Store the new delivery fee in local storage
        setDeliveryFee(''); // Clear input field

        // Trigger a storage event to update the delivery fee in other tabs/windows
        const event = new StorageEvent('storage', {
          key: 'deliveryFee',
          newValue: Number(deliveryFee),
        });
        window.dispatchEvent(event);
        console.log('Storage event dispatched with new delivery fee:', Number(deliveryFee));
      } else {
        toast.error('Error changing delivery fee.');
      }
    } catch (error) {
      console.error('Error changing delivery fee:', error);
      toast.error('Error changing delivery fee.');
    }
  };

  const formatPrice = (value) => {
    return `₦${value.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="change-delivery-fee-container">
      <h2>Change Delivery Fee</h2>
      <div className="current-fee">
        <strong>Current Delivery Fee:</strong> {formatPrice(currentDeliveryFee)}
      </div>
      <form onSubmit={handleChangeDeliveryFee}>
        <div>
          <label className="label">New Delivery Fee (₦):</label>
          <input
            type="number"
            value={deliveryFee}
            onChange={(e) => setDeliveryFee(e.target.value)} // Keep value as string for an empty input
            placeholder="Enter new delivery fee in Naira"
            required
          />
        </div>
        <button type="submit">Change Delivery Fee</button>
      </form>
    </div>
  );
};

export default ChangeDeliveryFee;
