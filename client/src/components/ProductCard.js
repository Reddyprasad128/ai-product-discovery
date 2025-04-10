import React from 'react';

function ProductCard({ product }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px', backgroundColor: '#fff' }}>
      <h3 style={{ margin: '0 0 10px', color: '#2c3e50' }}>{product.name}</h3>
      <p>{product.description}</p>
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Category:</strong> {product.category}</p>
    </div>
  );
}

export default ProductCard;	