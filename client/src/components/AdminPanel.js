import React, { useState } from 'react';
import axios from 'axios';

function AdminPanel({ token, fetchProducts }) {
  const [product, setProduct] = useState({ name: '', description: '', price: '', category: '' });
  const API_URL = process.env.REACT_APP_API_URL;

  const handleAdd = async () => {
    try {
      await axios.post(`${API_URL}/api/products`, product, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
      setProduct({ name: '', description: '', price: '', category: '' });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      <input
        value={product.name}
        onChange={(e) => setProduct({ ...product, name: e.target.value })}
        placeholder="Product Name"
      />
      <input
        value={product.description}
        onChange={(e) => setProduct({ ...product, description: e.target.value })}
        placeholder="Description"
      />
      <input
        type="number"
        value={product.price}
        onChange={(e) => setProduct({ ...product, price: e.target.value })}
        placeholder="Price"
      />
      <input
        value={product.category}
        onChange={(e) => setProduct({ ...product, category: e.target.value })}
        placeholder="Category"
      />
      <button onClick={handleAdd}>Add Product</button>
    </div>
  );
}

export default AdminPanel;