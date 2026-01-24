import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useRitual } from '../context/RitualContext.jsx';
import './DetailPanel.css';

const DetailPanel = ({ product, isOpen, onClose }) => {
  const { currentLang, t } = useLanguage();
  const { addToRitual, ritualItems } = useRitual();
  const [isAdding, setIsAdding] = useState(false);
  const [quickAdding, setQuickAdding] = useState(false);

  if (!product) return null;

  // Check if this product is already in the ritual
  const inRitual = ritualItems.find(item => item.id === product.id);
  const quantityInRitual = inRitual ? inRitual.quantity : 0;

  const handleAddToRitual = () => {
    setIsAdding(true);
    addToRitual(product);
    
    // Reset animation state
    setTimeout(() => {
      setIsAdding(false);
    }, 800);
  };

  const handleQuickAdd = () => {
    setQuickAdding(true);
    addToRitual(product);
    
    setTimeout(() => {
      setQuickAdding(false);
    }, 600);
  };

  return (
    <>
      <div 
        className={`panel-overlay ${isOpen ? 'show' : ''}`} 
        onClick={onClose}
      />
      <div className={`detail-panel ${isOpen ? 'open' : ''}`}>
        {/* Header with close and quick-add */}
        <div className="panel-header">
          <div className="btn-close" onClick={onClose}>
            {t.close}
          </div>
          <button 
            className={`quick-add-btn ${quickAdding ? 'adding' : ''} ${quantityInRitual > 0 ? 'has-items' : ''}`}
            onClick={handleQuickAdd}
            aria-label={t.buy}
          >
            <span className="quick-add-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
            <span className="quick-add-text">{t.ritualLabel}</span>
            {quantityInRitual > 0 && (
              <span className="quick-add-count">{quantityInRitual}</span>
            )}
            <span className="quick-add-check">✓</span>
          </button>
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
        
        <button 
          className={`buy-btn ${isAdding ? 'adding' : ''}`}
          onClick={handleAddToRitual}
        >
          <span className="buy-btn-text">{t.buy}</span>
          <span className="buy-btn-success">✓</span>
        </button>
      </div>
    </>
  );
};

export default DetailPanel;

