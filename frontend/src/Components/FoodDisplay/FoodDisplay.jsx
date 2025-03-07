import React, { useContext, useState, useEffect } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../Context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);
  const [isOpen, setIsOpen] = useState(false);

  // Ensure food_list is always an array by using a fallback to an empty array
  const displayFoodList = Array.isArray(food_list) ? food_list : [];

  useEffect(() => {
    const checkOperatingHours = () => {
      const now = new Date();
      const nigerianTimeOffset = 1; // Nigerian time is UTC+1
      const currentHour = now.getUTCHours() + nigerianTimeOffset;

      // Check if current time is between 6 AM and 9 PM
      setIsOpen(currentHour >= 6 && currentHour < 29);
    };

    checkOperatingHours();
    const interval = setInterval(checkOperatingHours, 60000); // Recheck every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="food-display" id="food-display">
      <h2>Specials... For You</h2>
      {isOpen ? (
        <div className="food-display-list">
          {displayFoodList.length > 0 ? (
            displayFoodList.map((item, index) => {
              if (category === "All" || category === item.category) {
                return (
                  <FoodItem
                    key={index}
                    id={item._id}
                    name={item.name}
                    description={item.description}
                    price={item.price}
                    image={item.image}
                    isAvailable={item.isAvailable} // Pass the isAvailable prop
                  />
                );
              }
              return null; // Return null for items that do not match the category
            })
          ) : (
            <p>No food items available for now</p>
          )}
        </div>
      ) : (
        <div className="closed-message">
          <h3>We're currently closed!</h3>
          <p>Opening Hours: 6 AM - 9 PM (Nigerian Time)</p>
          <div className="entertainment">
            <p>Here's something to keep you entertained:</p>
            <div className="video-container">
              <video
                controls
                autoPlay
                loop
                muted
                className="entertainment-video"
              >
                <source src="/mama.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <p>"Good food is worth the wait!"</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodDisplay;
