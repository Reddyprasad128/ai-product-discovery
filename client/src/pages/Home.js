import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatBox from '../components/ChatBox';
import ProductCard from '../components/ProductCard';
import AdminPanel from '../components/AdminPanel';

function Home({ token, role, setToken }) {
  const [products, setProducts] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!token) window.location.href = '/login';
    fetchProducts();
  }, [token]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  return (
    <div className="container">
      <div className="header">
        <h1>AI Product Discovery Tool</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
      {role === 'admin' && <AdminPanel token={token} fetchProducts={fetchProducts} />}
      <ChatBox token={token} setProducts={setProducts} />
      <div className="grid">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default Home;