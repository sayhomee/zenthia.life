import React from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import GinkgoIcon from './GinkgoIcon.jsx';
import './ProductCard.css';

const ProductCard = ({ product, index, onOpenDetail }) => {
  const { currentLang, t } = useLanguage();

  return (
    <div 
      className="p-card visible" 
      style={{ transitionDelay: `${index * 0.01}s` }}
      onClick={() => onOpenDetail(product.id)}
    >
      <div className="p-num">{product.id}</div>
      <div className="p-side">
        <span className="p-meridian">{product.org.join('・')}{t.meridian}</span>
        <div className="p-name-cn">{product[currentLang]}</div>
        <span className="p-name-en">{product.en}</span>
        <div className="p-name-jp">{product.jp}</div>
      </div>
      <div className="p-main">
        <span className="p-lbl">{t.eff}</span>
        <div className="p-eff">{product.eff[currentLang]}</div>
        <span className="p-lbl">{t.tg}</span>
        <div className="p-tg">{product.tg[currentLang]}</div>
        <button className="molecular-btn">
          <GinkgoIcon />
          <span>{t.molData}</span>
        </button>
      </div>
      <div className="p-formula">
        <span className="p-lbl">{t.form}</span>
        {product.ing.slice(0, 3).map((ingredient, idx) => (
          <div className="f-item" key={idx}>
            <span className="f-cn">{ingredient.cn}</span>
            <span className="f-jp">{ingredient.jp}</span>
            <span className="f-en">{ingredient.en}</span>
          </div>
        ))}
        {product.ing.length > 3 && (
          <div className="more-indicator">{t.more}</div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

