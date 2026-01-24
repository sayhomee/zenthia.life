import React, { useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useRitual } from '../context/RitualContext.jsx';
import './RitualDrawer.css';

const RitualDrawer = () => {
  const { currentLang, t } = useLanguage();
  const { 
    ritualItems, 
    isRitualOpen, 
    closeRitual, 
    updateQuantity, 
    removeFromRitual,
    clearRitual,
    totalItems,
    openCheckout
  } = useRitual();
  
  const drawerRef = useRef(null);

  // Close drawer on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isRitualOpen) {
        closeRitual();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isRitualOpen, closeRitual]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isRitualOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isRitualOpen]);

  return (
    <>
      <div 
        className={`ritual-overlay ${isRitualOpen ? 'show' : ''}`} 
        onClick={closeRitual}
      />
      <div 
        ref={drawerRef}
        className={`ritual-drawer ${isRitualOpen ? 'open' : ''}`}
      >
        {/* Header */}
        <div className="ritual-header">
          <div className="ritual-header-top">
            <button className="ritual-close" onClick={closeRitual}>
              <span className="close-icon">✕</span>
              <span className="close-text">{t.ritualClose}</span>
            </button>
          </div>
          <div className="ritual-title-area">
            <h2 className="ritual-title">{t.ritualTitle}</h2>
            <p className="ritual-subtitle">{t.ritualSubtitle}</p>
          </div>
          <div className="ritual-count-badge">
            <span className="count-number">{totalItems}</span>
            <span className="count-label">{t.ritualItems}</span>
          </div>
        </div>

        {/* Items Container */}
        <div className="ritual-items-container">
          {ritualItems.length === 0 ? (
            <div className="ritual-empty">
              <div className="empty-icon">
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"/>
                  <path d="M32 18v10M32 36v2M24 28h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <p className="empty-title">{t.ritualEmpty}</p>
              <p className="empty-desc">{t.ritualEmptyDesc}</p>
            </div>
          ) : (
            <>
              {ritualItems.map((item, index) => (
                <div 
                  key={item.id} 
                  className="ritual-item"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="ritual-item-main">
                    <div className="ritual-item-number">{item.id}</div>
                    <div className="ritual-item-info">
                      <span className="ritual-item-meridian">{item.org.join('・')}</span>
                      <h3 className="ritual-item-name">{item[currentLang]}</h3>
                      <span className="ritual-item-name-sub">{item.en}</span>
                    </div>
                  </div>
                  <div className="ritual-item-controls">
                    <div className="quantity-control">
                      <button 
                        className="qty-btn qty-decrease"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <span>−</span>
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button 
                        className="qty-btn qty-increase"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <span>+</span>
                      </button>
                    </div>
                    <button 
                      className="remove-btn"
                      onClick={() => removeFromRitual(item.id)}
                      aria-label="Remove item"
                    >
                      {t.ritualRemove}
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer Actions */}
        {ritualItems.length > 0 && (
          <div className="ritual-footer">
            <button className="ritual-clear" onClick={clearRitual}>
              {t.ritualClear}
            </button>
            <button className="ritual-checkout" onClick={openCheckout}>
              <span className="checkout-text">{t.ritualCheckout}</span>
              <span className="checkout-arrow">→</span>
            </button>
          </div>
        )}

        {/* Decorative Elements */}
        <div className="ritual-deco-top"></div>
        <div className="ritual-deco-bottom"></div>
      </div>
    </>
  );
};

export default RitualDrawer;

