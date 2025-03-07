 import { createContext, useState, useEffect } from "react";
import axios from "axios"; // Ensure this import is correct

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [eventData, setEventData] = useState([]);
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [food_list, setFoodList] = useState([]);
  const [notification, setNotification] = useState(null);

  const url = "http://localhost:4000";

  const showNotification = (message, type, autoClose = 3000) => {
    setNotification({ message, type, autoClose });
    setTimeout(() => {
      setNotification(null);
    }, autoClose);
  };

  const addToCart = async (itemId) => {
    const updatedCartItems = { ...cartItems };

    if (!updatedCartItems[itemId]) {
      updatedCartItems[itemId] = 1;
    } else {
      updatedCartItems[itemId] += 1;
    }

    setCartItems(updatedCartItems);

    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/add`,
          { itemId },
          { headers: { token } }
        );
        showNotification("Item added to cart!", "success");
      } catch (error) {
        console.error("Error adding item to cart:", error);
        showNotification("Failed to add item to cart.", "error");
      }
    } else {
      showNotification("You are not authenticated, please Login", "error");
    }
  };

  const removeFromCart = async (itemId) => {
    const updatedCartItems = { ...cartItems };

    if (updatedCartItems[itemId] > 1) {
      updatedCartItems[itemId] -= 1;
    } else {
      delete updatedCartItems[itemId];
    }

    setCartItems(updatedCartItems);

    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/remove`,
          { itemId },
          { headers: { token } }
        );
        showNotification("Item removed from cart!", "info");
      } catch (error) {
        console.error("Error removing item from cart:", error);
        showNotification("Failed to remove item from cart.", "error");
      }
    }
  };

  const clearCart = async () => {
    console.log("Clearing cart..."); // Debugging statement
    setCartItems({});

    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/clear`,
          {},
          { headers: { token } }
        );
        showNotification("Cart cleared successfully!", "success");
      } catch (error) {
        console.error("Error clearing cart:", error);
        showNotification("Failed to clear cart.", "error");
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const itemQuantity = cartItems[itemId];
      if (itemQuantity > 0) {
        const itemInfo = food_list.find((product) => product._id === itemId);
        if (itemInfo) {
          totalAmount += itemInfo.price * itemQuantity;
        }
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      setFoodList(response.data.data);
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  };

  const loadCartData = async (userToken) => {
    try {
      const response = await axios.post(
        `${url}/api/cart/get`,
        {},
        { headers: { token: userToken } }
      );
      setCartItems(response.data.cartData);
    } catch (error) {
      console.error("Error loading cart data:", error);
    }
  };

  const fetchEventData = async (userToken, userID) => {
    try {
      const response = await axios.get(`${url}/api/events/list`, {
        headers: { token: userToken },
        params: { userId: userID },
      });
      setEventData(response.data.data);
    } catch (error) {
      console.error("Error fetching event data:", error);
    }
  };

  const fetchUserId = async (userToken) => {
    try {
      const response = await axios.get(`${url}/api/user/profile`, {
        headers: { token: userToken },
      });
      setUserId(response.data.userId);
    } catch (error) {
      console.error("Error fetching user ID:", error);
    }
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        await loadCartData(storedToken);
        await fetchUserId(storedToken);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (token && userId) {
      fetchEventData(token, userId);
    }
  }, [token, userId]);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    clearCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    eventData,
    setEventData,
    userId,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
      {notification && (
        <div
          className={`notification ${notification.type}`}
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "15px",
            borderRadius: "5px",
            color: "white",
            fontSize: "16px",
            zIndex: 1000,
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            backgroundColor:
              notification.type === "success"
                ? "#4caf50"
                : notification.type === "error"
                ? "#f44336"
                : notification.type === "info"
                ? "#2196f3"
                : "#4caf50",
          }}
        >
          {notification.message}
        </div>
      )}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
