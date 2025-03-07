import React, { useContext, useState, useEffect } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../Context/StoreContext";

const FoodItem = ({ id, name, price, description, image, isAvailable }) => {
  const { cartItems = {}, addToCart, removeFromCart, url, userId } = useContext(StoreContext);
  const [rating, setRating] = useState(5); // Set default rating to 5 stars
  const [hasRated, setHasRated] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/rating/getRating?foodId=${id}&userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.rating) {
            setRating(data.rating);
            setHasRated(true);
          }
        } else {
          console.error('Failed to fetch rating');
        }
      } catch (error) {
        console.error('Error fetching rating:', error);
      }
    };

    if (userId) {
      fetchRating();
    }
  }, [id, userId]);

  const handleRatingClick = (newRating) => {
    if (!userId) {
      setNotification("Please log in to rate our food");
      setTimeout(() => {
        setNotification(null);
      }, 3000); // Notification will disappear after 3 seconds
      return;
    }

    if (hasRated) {
      setNotification("You have already rated this item.");
      setTimeout(() => {
        setNotification(null);
      }, 3000); // Notification will disappear after 3 seconds
      return;
    }

    setRating(newRating);
    setHasRated(true);
    saveRatingToDatabase(id, newRating);
    saveRatingToLocalStorage(id, newRating);
    setNotification("Thank you for rating!");
    setTimeout(() => {
      setNotification(null);
    }, 3000); // Notification will disappear after 3 seconds
  };

  const saveRatingToDatabase = async (foodId, rating) => {
    try {
      const token = localStorage.getItem('token'); // Ensure the token is correctly retrieved
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await fetch('http://localhost:4000/api/rating/saveRating', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Ensure the token is correctly passed
        },
        body: JSON.stringify({ foodId, rating }),
      });
      if (response.ok) {
        console.log('Rating saved successfully');
      } else {
        console.error('Failed to save rating');
      }
    } catch (error) {
      console.error('Error saving rating:', error);
    }
  };

  const saveRatingToLocalStorage = (foodId, rating) => {
    const ratings = JSON.parse(localStorage.getItem('foodRatings')) || {};
    ratings[foodId] = rating;
    localStorage.setItem('foodRatings', JSON.stringify(ratings));
  };

  const formatPrice = (price) => {
    const formattedPrice = price.toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const [currencySymbol, priceValue] = formattedPrice.split("₦");

    return (
      <span className="food-item-price">
        <span className="currency-symbol">₦</span>
        <span className="price-value">{priceValue}</span>
      </span>
    );
  };

  const renderAddToCartButton = () => {
    if (!isAvailable) {
      return null;
    }

    if (!cartItems[id] || cartItems[id] === 0) {
      return (
        <img
          className="add"
          onClick={() => addToCart(id)}
          src={assets.add_icon_white}
          alt="Add to cart"
        />
      );
    }

    return (
      <div className="food-item-counter">
        <img
          onClick={() => removeFromCart(id)}
          src={assets.remove_icon_red}
          alt="Remove from cart"
        />
        <p>{cartItems[id] || 0}</p>
        <img
          onClick={() => addToCart(id)}
          src={assets.add_icon_green}
          alt="Add more"
        />
      </div>
    );
  };

  const imageSrc = image.startsWith("https://i.ibb.co/") ? image : `${url}/images/${image}`;

  return (
    <div className={`food-item ${isAvailable ? "" : "unavailable"}`}>
      {notification && (
        <div className="notification">
          <p>{notification}</p>
          <button onClick={() => setNotification(null)}>Close</button>
        </div>
      )}
      <style>{`
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          font-weight: bolder;
          background-color:rgb(119, 255, 7);
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
      <div className="food-item-img-container">
        <img
          className="food-item-image"
          src={imageSrc}
          alt={name || "Food item"}
        />
        {renderAddToCartButton()}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => handleRatingClick(star)}
                className={`star ${star <= rating ? 'rated' : ''}`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        <p className="food-item-description">{description}</p>
        <div className="food-item-price-availability">
          {formatPrice(price)}
          {isAvailable !== undefined && (
            <div className={`availability-badge ${isAvailable ? "available" : "unavailable"}`}>
              {isAvailable ? "Available" : "Unavailable"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodItem;
