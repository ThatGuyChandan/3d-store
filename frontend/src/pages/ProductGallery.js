import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginPromptPopup from '../components/LoginPromptPopup'; // Import the new popup component
import './ProductGallery.css';

const ProductGallery = ({ isPublic }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showLoginPopup, setShowLoginPopup] = useState(false); // State for popup visibility

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let response;
        if (isPublic) {
          // For public view, ensure no auth token is sent
          response = await axios.get('http://localhost:5000/api/products', { headers: { 'x-auth-token': '' } });
        } else {
          // For authenticated view, axios interceptor will handle the token
          response = await axios.get('http://localhost:5000/api/products');
        }
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]); // Clear products on error
      }
    };

    fetchProducts();
  }, [isPublic]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductClick = (productId) => {
    if (isPublic && !isAuthenticated) {
      setShowLoginPopup(true); // Show the custom popup
    } else {
      navigate(`/products/${productId}`);
    }
  };

  return (
    <div className="product-gallery">
      <h1>{isPublic ? 'Explore Our Products' : 'My Products'}</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search products by name..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      {filteredProducts.length > 0 ? (
        <div className="product-list">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card" onClick={() => handleProductClick(product.id)}>
              <img src={product.image} alt={product.name} />
              <div className="product-card-content">
                <h2>{product.name}</h2>
                <p className="category">{product.category}</p>
                <p className="price">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-products-found">
          <h2>No products found</h2>
          <p>Try adjusting your search, or browse all products.</p>
        </div>
      )}

      {showLoginPopup && <LoginPromptPopup onClose={() => setShowLoginPopup(false)} />}
    </div>
  );
};

export default ProductGallery;