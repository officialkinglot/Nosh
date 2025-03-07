import React, { useState } from "react";
import "./Add.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const Add = () => {
  const url = "http://localhost:4000";
  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Swallow",
    isAvailable: true,
  });
  const [loading, setLoading] = useState(false); // New state for loading

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((data) => ({ ...data, [name]: value }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount);
  };

  const parseCurrency = (formattedAmount) => {
    return parseFloat(formattedAmount.replace(/[^0-9.-]+/g, ""));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true); // Start loading
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", parseCurrency(data.price));
    formData.append("category", data.category);
    formData.append("isAvailable", data.isAvailable);
    formData.append("image", image);

    try {
      const response = await axios.post(`${url}/api/food/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setLoading(false); // Stop loading
      if (response.data.success) {
        setData({
          name: "",
          description: "",
          price: "",
          category: "Swallow",
          isAvailable: true,
        });
        setImage(null);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      setLoading(false); // Stop loading
      toast.error("An error occurred while adding the food item.");
      console.error("Error adding food item:", error);
    }
  };

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.uploadicon}
              alt="Upload Icon"
            />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </div>
        <div className="add-product-name flex-col">
          <h4>Product Name</h4>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Type Here"
            required
          />
        </div>
        <div className="add-product-description flex-col">
          <h4>Product Description</h4>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="6"
            placeholder="Write Contents Here"
            required
          ></textarea>
        </div>
        <div className="add-category-price">
          <div className="add-category flex-col">
            <h4>Food Category</h4>
            <select
              onChange={onChangeHandler}
              value={data.category}
              name="category"
              required
            >
              {/* Options */}
              <option value="Swallow">Swallow</option>
              <option value="Rice">Rice</option>
              <option value="Meat/Fish">Meat/Fish</option>
              <option value="Extras">Extras</option>
              <option value="Drinks">Drinks</option>
              <option value="Cakes">Cakes</option>
              <option value="Pepper Soup">Pepper Soup</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <h4>Food Price</h4>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="text"
              name="price"
              placeholder="e.g 1000"
              onBlur={(e) => setData({ ...data, price: formatCurrency(parseCurrency(e.target.value)) })}
              required
            />
          </div>
          <div className="add-availability flex-col">
            <h4>Availability</h4>
            <select
              onChange={onChangeHandler}
              value={data.isAvailable}
              name="isAvailable"
              required
            >
              <option value={true}>Available</option>
              <option value={false}>Unavailable</option>
            </select>
          </div>
        </div>
        <button type="submit" className="add-button" disabled={loading}>
          {loading ? "Uploading..." : "Add"}
        </button>
      </form>
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default Add;
