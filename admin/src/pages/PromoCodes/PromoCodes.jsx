import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { url } from '../../App';
import "./PromoCodes.css";

const PromoCodes = ({ userId }) => {
  const [promoCodes, setPromoCodes] = useState([]);
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('');
  const [newExpiresDate, setNewExpiresDate] = useState('');
  const [newExpiresHour, setNewExpiresHour] = useState('');
  const [newExpiresMinute, setNewExpiresMinute] = useState('');
  const [newExpiresPeriod, setNewExpiresPeriod] = useState('AM');
  const [appliedCode, setAppliedCode] = useState(null);
  const [reducedTotal, setReducedTotal] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0); // Assume this is the total amount of the cart

  useEffect(() => {
    const fetchPromoCodes = async () => {
      try {
        const response = await axios.get(`${url}/api/promo-code/list`);
        setPromoCodes(response.data);
      } catch (error) {
        console.error('Error fetching promo codes:', error);
      }
    };
    fetchPromoCodes();
  }, []);

  useEffect(() => {
    const fetchAppliedPromoCode = async () => {
      try {
        const response = await axios.get(`${url}/api/promo-code/applied/${userId}`);
        if (response.data) {
          setAppliedCode(response.data.code);
          setReducedTotal(response.data.reducedTotal);
        }
      } catch (error) {
        console.error('Error fetching applied promo code:', error);
      }
    };
    fetchAppliedPromoCode();
  }, [userId]);

  const handleAddPromoCode = async () => {
    const formattedTime = `${newExpiresHour.padStart(2, '0')}:${newExpiresMinute.padStart(2, '0')} ${newExpiresPeriod}`;
    const formattedDate = `${newExpiresDate} ${formattedTime}`;
    const expiresAt = moment.tz(formattedDate, 'YYYY-MM-DD hh:mm A', 'Africa/Lagos').toISOString();

    try {
      const response = await axios.post(`${url}/api/promo-code/add`, {
        code: newCode,
        discount: newDiscount,
        expiresAt,
        usedBy: [] // Initialize the usedBy field as an empty array
      });
      setPromoCodes([...promoCodes, response.data]);
      setNewCode('');
      setNewDiscount('');
      setNewExpiresDate('');
      setNewExpiresHour('');
      setNewExpiresMinute('');
      setNewExpiresPeriod('AM');
    } catch (error) {
      console.error('Error adding promo code:', error);
    }
  };

  const handleApplyPromoCode = async (code) => {
    try {
      const response = await axios.post(`${url}/api/promo-code/apply`, { code, userId, totalAmount });
      setAppliedCode(response.data.code);
      setReducedTotal(response.data.reducedTotal);
      // Update the promoCodes state to reflect the usedBy change
      setPromoCodes(promoCodes.map(pc => pc.code === code ? { ...pc, usedBy: [...pc.usedBy, userId] } : pc));
    } catch (error) {
      console.error('Error applying promo code:', error);
    }
  };

  const handleDeletePromoCode = async (code) => {
    try {
      await axios.delete(`${url}/api/promo-code/delete/${code}`);
      setPromoCodes(promoCodes.filter(pc => pc.code !== code));
    } catch (error) {
      console.error('Error deleting promo code:', error);
    }
  };

  const formatDateTime = (dateString) => {
    const date = moment(dateString).tz('Africa/Lagos');
    const day = date.date();
    const ordinal = (n) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return s[(v - 20) % 10] || s[v] || s[0];
    };
    return `${day}${ordinal(day)} ${date.format('MMMM YYYY, h:mm A')}`;
  };

  const getNigerianTime = () => {
    return moment().tz('Africa/Lagos');
  };

  const activePromoCodes = promoCodes.filter(code => moment(code.expiresAt).isAfter(getNigerianTime()) && !code.usedBy.includes(userId));
  const expiredPromoCodes = promoCodes.filter(code => moment(code.expiresAt).isSameOrBefore(getNigerianTime()) || code.usedBy.includes(userId));

  return (
    <div className="promo-code-container">
      <h2 className="promo-title">Promo Codes</h2>
      <p className="promo-instructions">Expired promo codes will be deleted after one month.</p>
      <div className="promo-form">
        <input
          type="text"
          placeholder="Code"
          value={newCode}
          onChange={(e) => setNewCode(e.target.value)}
          className="promo-input"
        />
        <input
          type="number"
          placeholder="Discount"
          value={newDiscount}
          onChange={(e) => setNewDiscount(e.target.value)}
          className="promo-input"
        />
        <input
          type="date"
          value={newExpiresDate}
          onChange={(e) => setNewExpiresDate(e.target.value)}
          className="promo-input"
        />
        <div className="time-picker-grid">
          <select
            value={newExpiresHour}
            onChange={(e) => setNewExpiresHour(e.target.value)}
            className="promo-input"
          >
            <option value="">Hour</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
              <option key={hour} value={hour}>
                {hour}
              </option>
            ))}
          </select>
          <select
            value={newExpiresMinute}
            onChange={(e) => setNewExpiresMinute(e.target.value)}
            className="promo-input"
          >
            <option value="">Minute</option>
            {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map((minute) => (
              <option key={minute} value={minute}>
                {minute}
              </option>
            ))}
          </select>
          <select
            value={newExpiresPeriod}
            onChange={(e) => setNewExpiresPeriod(e.target.value)}
            className="promo-input"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
        <button onClick={handleAddPromoCode} className="promo-button">Add Promo Code</button>
      </div>
      <div className="promo-lists-container">
        <div className="promo-list-section">
          <h3>Active Promo Codes</h3>
          <ul className="promo-list">
            {activePromoCodes.map((code) => (
              <li key={code._id} className="promo-item">
                {code.code} - {code.discount}% (Expires: {formatDateTime(code.expiresAt)})
                <button onClick={() => handleApplyPromoCode(code.code)} className="apply-button">Apply</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="promo-list-section">
          <h3>Expired Promo Codes</h3>
          <table className="promo-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Expired At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expiredPromoCodes.map((code) => (
                <tr key={code._id} className="promo-item expired">
                  <td>{code.code}</td>
                  <td>{code.discount}%</td>
                  <td>{formatDateTime(code.expiresAt)}</td>
                  <td>
                    <button onClick={() => handleDeletePromoCode(code.code)} className="delete-button">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {appliedCode && (
        <div className="applied-code">
          <h3>Applied Promo Code</h3>
          <p>{appliedCode} - Discount Applied</p>
          <p>Reduced Total: ${reducedTotal}</p>
        </div>
      )}
    </div>
  );
};

export default PromoCodes;
