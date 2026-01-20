import React from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import './DetailPanel.css';

const DetailPanel = ({ product, isOpen, onClose }) => {
  const { currentLang, t } = useLanguage();

  if (!product) return null;

  return (
    <>
      <div 
        className={`panel-overlay ${isOpen ? 'show' : ''}`} 
        onClick={onClose}
      />
      <div className={`detail-panel ${isOpen ? 'open' : ''}`}>
        <div className="btn-close" onClick={onClose}>
          {t.close}
        </div>
        <h2 className="panel-title-cn">{product[currentLang]}</h2>
        <div className="panel-title-en">{product.en} / {product.jp}</div>
        <div className="panel-desc">{product.eff[currentLang]}</div>
        
        <span className="p-lbl">{t.fullForm}</span>
        <div className="full-formula-grid">
          {product.ing.map((ingredient, idx) => (
            <div className="f-item-full" key={idx}>
              <span className="f-cn-full">{ingredient.cn}</span>
              <span className="f-jp-full">{ingredient.jp}</span>
              <span className="f-en-full">{ingredient.en}</span>
            </div>
          ))}
        </div>
        
        <span className="p-lbl">{t.trace}</span>
        <div className="timeline-container">
          {t.steps.map((step, idx) => (
            <div className="timeline-item" key={idx}>
              <span className="t-step">Step 0{idx + 1}</span>
              <div className="t-desc">{step}</div>
            </div>
          ))}
        </div>
        
        <button className="buy-btn">{t.buy}</button>
      </div>
    </>
  );
};

export default DetailPanel;

