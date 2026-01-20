import React from 'react';
import ProductCard from './ProductCard.jsx';
import './Catalog.css';

const Catalog = ({ products, onOpenDetail }) => {
  return (
    <div className="catalog">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          onOpenDetail={onOpenDetail}
        />
      ))}
    </div>
  );
};

export default Catalog;

