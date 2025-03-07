import React, { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";

const List = ({ url }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        const sortedList = response.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setList(sortedList);
      } else {
        toast.error("Error fetching food list");
      }
    } catch (error) {
      toast.error("Error fetching food list");
    }
  };

  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, {
        id: foodId,
      });
      await fetchList();
      if (response.data.success) {
        toast.success("Food item removed successfully");
      } else {
        toast.error("Error removing food item");
      }
    } catch (error) {
      toast.error("Error removing food item");
      console.error("Error removing food item:", error);
    }
  };

  const updateAvailability = async (foodId, isAvailable) => {
    try {
      const response = await axios.post(`${url}/api/food/updateAvailability`, {
        id: foodId,
        isAvailable: isAvailable,
      });
      await fetchList();
      if (response.data.success) {
        toast.success("Food item availability updated successfully");
      } else {
        toast.error("Error updating food item availability");
      }
    } catch (error) {
      toast.error("Error updating food item availability");
    }
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
    });
  };

  useEffect(() => {
    fetchList();
  }, [url]);

  return (
    <div className="list add flex col">
      <p className="list">All Food Lists</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Availability</b>
          <b>Delete</b>
        </div>
        {list.map((item, index) => (
          <div key={index} className="list-table-format p">
            <img src={item.image.startsWith("https://i.ibb.co/") ? item.image : `${url}/images/${item.image}`} alt={item.name} />
            <p>{item.name}</p>
            <p style={{ cursor: 'pointer', color: 'black' }}>{item.category}</p>
            <p style={{ cursor: 'pointer', color: 'blue' }}>{formatCurrency(item.price)}</p>
            <div className="availability-checkboxes">
              <label>
                <input
                  type="radio"
                  name={`availability-${item._id}`}
                  value="true"
                  checked={item.isAvailable}
                  onChange={() => updateAvailability(item._id, true)}
                />
                Available
              </label>
              <label>
                <input
                  type="radio"
                  name={`availability-${item._id}`}
                  value="false"
                  checked={!item.isAvailable}
                  onChange={() => updateAvailability(item._id, false)}
                />
                Not Available
              </label>
            </div>
            <p onClick={() => removeFood(item._id)} style={{ cursor: 'pointer', color: 'green' }}>X</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
