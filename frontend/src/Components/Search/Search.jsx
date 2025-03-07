import React, { useState, useContext } from "react";
import "./Search.css";
import { StoreContext } from "../../Context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const Search = ({ category }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const { food_list } = useContext(StoreContext);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filteredProducts =
      food_list &&
      food_list.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase()) &&
        (category === "All" || category === product.category) &&
        product.isAvailable // Ensure the item is available
      );
    setSearchData(filteredProducts);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input"
      />
      {searchData && searchData.length !== 0 ? (
        <div className="search-results">
          {searchData.map((product, index) => (
            <FoodItem
              key={index}
              id={product._id}
              name={product.name}
              description={product.description}
              price={product.price}
              image={product.image}
              isAvailable={product.isAvailable} // Pass the isAvailable prop
            />
          ))}
        </div>
      ) : (
        <p> </p>
      )}
    </div>
  );
};

export default Search;
