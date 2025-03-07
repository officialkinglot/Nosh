import React, { useContext, useState, useEffect } from 'react';
import './Cart.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Cart = () => {
  const {
    cartItems,
    food_list,
    removeFromCart,
    getTotalCartAmount,
    token,
    clearCart,
    url,
  } = useContext(StoreContext);

  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(1000); // Default delivery fee
  const [discount, setDiscount] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState(null);
  const [promoCodeUsed, setPromoCodeUsed] = useState(false);

  useEffect(() => {
    const fetchDeliveryFee = async () => {
      try {
        const response = await axios.get(`${url}/api/admin/delivery-fee`);
        setDeliveryFee(response.data.deliveryFee);
        localStorage.setItem('deliveryFee', response.data.deliveryFee); // Store the delivery fee in local storage
      } catch (error) {
        console.error('Error fetching delivery fee:', error);
      }
    };

    const handleStorageChange = (event) => {
      if (event.key === 'deliveryFee') {
        setDeliveryFee(Number(event.newValue));
      }
    };

    fetchDeliveryFee();

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [url]);

  useEffect(() => {
    // Load promo code and discount from localStorage on mount
    const storedPromoCode = localStorage.getItem('appliedPromoCode');
    const storedDiscount = localStorage.getItem('appliedDiscount');
    const storedPromoCodeUsed = localStorage.getItem('promoCodeUsed') === 'true';

    if (storedPromoCode) {
      setAppliedPromoCode(storedPromoCode);
    }

    if (storedDiscount) {
      setDiscount(Number(storedDiscount));
    }

    setPromoCodeUsed(storedPromoCodeUsed);

    const storedNotification = localStorage.getItem('notification');
    if (storedNotification) {
      setNotification(storedNotification);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(cartItems).length === 0) {
      setDiscount(0);
      setAppliedPromoCode(null);
      setPromoCodeUsed(false); // Reset promo code used status
      localStorage.removeItem('appliedDiscount');
      localStorage.removeItem('appliedPromoCode');
      localStorage.removeItem('promoCodeUsed');
      localStorage.removeItem('notification');
    }
  }, [cartItems]);

  const handleCheckout = () => {
    if (!token) {
      setNotification('Please log in to place an order.');
      localStorage.setItem('notification', 'Please log in to place an order.');
      setTimeout(() => {
        setNotification(null);
        localStorage.removeItem('notification');
      }, 3000); // Notification will disappear after 3 seconds
    } else {
      navigate('/order', { state: { discount } }); // Pass the discount to the order page
    }
  };

  const closeNotification = () => {
    setNotification(null);
    localStorage.removeItem('notification');
  };

  const Notification = ({ message, onClose }) => {
    return (
      <div className="notification">
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };

  const handlePaymentSuccess = () => {
    clearCart(); // Clear the cart if payment is successful
    localStorage.removeItem('appliedDiscount'); // Clear the applied discount from local storage
    localStorage.removeItem('appliedPromoCode'); // Clear the applied promo code from local storage
    localStorage.removeItem('promoCodeUsed'); // Clear the promo code used flag from local storage
    localStorage.removeItem('cartItems'); // Clear the cart items from local storage
    localStorage.removeItem('notification'); // Clear the notification from local storage
    setDiscount(0);
    setAppliedPromoCode(null);
    setPromoCodeUsed(false); // Reset promo code used status
    setNotification('Payment successful! Your order has been placed.');
    localStorage.setItem('notification', 'Payment successful! Your order has been placed.');
    setTimeout(() => {
      setNotification(null);
      localStorage.removeItem('notification');
    }, 3000); // Notification will disappear after 3 seconds
  };

  const handlePaymentFailure = () => {
    setNotification('Payment failed. Please try again.');
    localStorage.setItem('notification', 'Payment failed. Please try again.');
    setTimeout(() => {
      setNotification(null);
      localStorage.removeItem('notification');
    }, 3000); // Notification will disappear after 3 seconds
  };

  const handleApplyPromoCode = async () => {
    if (Object.keys(cartItems).length === 0) {
      setNotification('Your cart is empty. Please add items before applying a promo code.');
      localStorage.setItem('notification', 'Your cart is empty. Please add items before applying a promo code.');
      setTimeout(() => {
        setNotification(null);
        localStorage.removeItem('notification');
      }, 3000); // Notification will disappear after 3 seconds
      return;
    }

    if (promoCodeUsed) {
      setNotification('You have already applied a promo code for this session.');
      localStorage.setItem('notification', 'You have already applied a promo code for this session.');
      setTimeout(() => {
        setNotification(null);
        localStorage.removeItem('notification');
      }, 3000); // Notification will disappear after 3 seconds
      return;
    }

    try {
      const response = await axios.post(`${url}/api/promo-code/apply`, {
        code: promoCode,
        userId: token,
        totalAmount: getTotalCartAmount(),
      });

      const { discount } = response.data;
      setDiscount(discount);
      setAppliedPromoCode(promoCode);
      setPromoCodeUsed(true);

      localStorage.setItem('appliedDiscount', discount); // Store discount
      localStorage.setItem('appliedPromoCode', promoCode); // Store promo code
      localStorage.setItem('promoCodeUsed', true); // Mark promo code as used

      setNotification('Promo code applied successfully!');
      localStorage.setItem('notification', 'Promo code applied successfully!');
      setTimeout(() => {
        setNotification(null);
        localStorage.removeItem('notification');
      }, 3000); // Notification will disappear after 3 seconds
    } catch (error) {
      setNotification(error.response?.data?.message || 'Error applying promo code');
      localStorage.setItem('notification', error.response?.data?.message || 'Error applying promo code');
      setTimeout(() => {
        setNotification(null);
        localStorage.removeItem('notification');
      }, 3000); // Notification will disappear after 3 seconds
    }
  };

  const getTotalWithDiscount = () => {
    const total = getTotalCartAmount();
    const discountAmount = (total * discount) / 100;
    return total === 0 ? 0 : total + deliveryFee - discountAmount;
  };

  return (
    <div className="cart">
      <style>{`
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          background-color: #f8d7da;
          color: #721c24;
          padding: 10px;
          border: 1px solid #f5c6cb;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          z-index: 1000;
        }

        .notification button {
          margin-left: 10px;
          background-color: #721c24;
          color: #fff;
          border: none;
          padding: 5px 10px;
          border-radius: 3px;
          cursor: pointer;
        }

        .notification button:hover {
          background-color: #5a181d;
        }
      `}</style>
      {notification && <Notification message={notification} onClose={closeNotification} />}
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p className="separate-title">Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list?.map((item, index) => {
          if (cartItems?.[item._id] > 0) {
            return (
              <div key={index}>
                <div className="cart-items-title cart-items-item">
                  <img
                    src={`${url}/images/${item.image || 'default.jpg'}`}
                    alt={item.name || 'Food item'}
                  />
                  <p>{item.name}</p>
                  <p>
                    {item.price?.toLocaleString('en-NG', {
                      style: 'currency',
                      currency: 'NGN',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p>{cartItems[item._id]}</p>
                  <p>
                    {(item.price * cartItems[item._id])?.toLocaleString('en-NG', {
                      style: 'currency',
                      currency: 'NGN',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="cross" onClick={() => removeFromCart(item._id)}>
                    X
                  </p>
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Sub Total</p>
              <p>
                {getTotalCartAmount() === 0
                  ? '₦0.00'
                  : getTotalCartAmount()?.toLocaleString('en-NG', {
                      style: 'currency',
                      currency: 'NGN',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
              </p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p className="delivery-fee">Delivery Fee</p>
              <p>
                {getTotalCartAmount() === 0
                  ? '₦0.00'
                  : deliveryFee?.toLocaleString('en-NG', {
                      style: 'currency',
                      currency: 'NGN',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
              </p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p className="discount">Discount</p>
              <p>
                {getTotalCartAmount() === 0
                  ? '₦0.00'
                  : (getTotalCartAmount() * (discount / 100))?.toLocaleString('en-NG', {
                      style: 'currency',
                      currency: 'NGN',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
              </p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b className="total">Total</b>
              <b>
                {getTotalWithDiscount()?.toLocaleString('en-NG', {
                  style: 'currency',
                  currency: 'NGN',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </b>
            </div>
          </div>
          <button onClick={handleCheckout}> PROCEED TO CHECKOUT </button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>Have a promocode? Enter it here</p>
            <div className="cart-promocode-input">
              <input
                type="text"
                placeholder="promocode"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button onClick={handleApplyPromoCode}>Submit</button>
            </div>
          </div>
          {appliedPromoCode && (
            <div className="applied-promocode">
              <p>Applied Promo Code: {appliedPromoCode}</p>
              <p>Discount: {discount}%</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;