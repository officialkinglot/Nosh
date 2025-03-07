import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { url } from "../../../../admin/src/App"; // Correct import statement

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    phone: "",
  });
  const [deliveryFee, setDeliveryFee] = useState(2000); // Default delivery fee
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const fetchDeliveryFee = async () => {
      try {
        const response = await axios.get(`${url}/api/admin/delivery-fee`);
        setDeliveryFee(response.data.deliveryFee);
      } catch (error) {
        console.error('Error fetching delivery fee:', error);
      }
    };
    fetchDeliveryFee();
  }, []);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("orderData");
    if (savedData) {
      setData(JSON.parse(savedData));
    }
  }, []);

  // Load discount from location state
  useEffect(() => {
    if (location.state && location.state.discount) {
      setDiscount(location.state.discount);
    }
  }, [location]);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    // Update state and save to localStorage
    const newData = { ...data, [name]: value };
    setData(newData);
    localStorage.setItem("orderData", JSON.stringify(newData));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id]) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });

    let orderData = {
      userId: token, // Assuming token contains the user ID
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + deliveryFee - (getTotalCartAmount() * (discount / 100)), // Use the dynamic delivery fee and discount
      email: data.email, // Add email to orderData
    };

    try {
      let response = await axios.post(url + "/api/order/place", orderData, {
        headers: { token },
      });
      if (response.data.success) {
        const { session_url } = response.data;

        // Clear localStorage after order is placed
        localStorage.removeItem("orderData");

        // Redirect to payment session
        window.location.replace(session_url);
      } else {
        alert("Error placing order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error placing order");
    }
  };

  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token, getTotalCartAmount, navigate]);

  const getTotalWithDiscount = () => {
    const total = getTotalCartAmount();
    const discountAmount = (total * discount) / 100;
    return total + deliveryFee - discountAmount;
  };

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title"> Delivery Information</p>
        <div className="multi-fields">
          <input
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            type="text"
            placeholder="First Name"
            required
          />
          <input
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            type="text"
            placeholder="Last Name"
            required
          />
        </div>
        <input
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          type="email"
          placeholder="Email Address"
          required
        />
        <input
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          type="text"
          placeholder="Street Address"
          required
        />
        <div className="multi-fields">
          <input
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            type="text"
            placeholder="City"
            required
          />
          <input
            name="state"
            onChange={onChangeHandler}
            value={data.state}
            type="text"
            placeholder="State"
            required
          />
        </div>
        <input
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          type="text"
          placeholder="Phone Number"
          required
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Sub Total</p>
              <p>
                {getTotalCartAmount().toLocaleString("en-NG", {
                  style: "currency",
                  currency: "NGN",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>
                {(getTotalCartAmount() === 0 ? 0 : deliveryFee).toLocaleString(
                  "en-NG",
                  {
                    style: "currency",
                    currency: "NGN",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Discount</p>
              <p>
                {(getTotalCartAmount() * (discount / 100)).toLocaleString("en-NG", {
                  style: "currency",
                  currency: "NGN",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                {getTotalWithDiscount().toLocaleString("en-NG", {
                  style: "currency",
                  currency: "NGN",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </b>
            </div>
          </div>
          <button type="submit"> PROCEED TO PAYMENT </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
