import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useRitual } from '../context/RitualContext.jsx';
import './RitualButton.css';

const RitualButton = () => {
  const { currentLang, t } = useLanguage();
  const { totalItems, toggleRitual, openRitual, addedTimestamp, ritualItems } = useRitual();
  const [isAnimating, setIsAnimating] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const toastTimeoutRef = useRef(null);

  // Animate when item is added
  useEffect(() => {
    if (addedTimestamp) {
      // Clear any existing timeout
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
      
      setIsAnimating(true);
      setShowToast(true);
      
      const animTimer = setTimeout(() => setIsAnimating(false), 600);
      toastTimeoutRef.current = setTimeout(() => setShowToast(false), 2500);
      
      return () => {
        clearTimeout(animTimer);
        if (toastTimeoutRef.current) {
          clearTimeout(toastTimeoutRef.current);
        }
      };
    }
  }, [addedTimestamp]);

  // Get first 3 items for preview
  const previewItems = ritualItems.slice(0, 3);

  return (
    <>
      {/* Toast Notification */}
      <div className={`ritual-toast ${showToast ? 'show' : ''}`}>
        <div className="toast-content">
          <span className="toast-icon">✓</span>
          <span className="toast-text">{t.ritualAdded}</span>
        </div>
        <div className="toast-progress"></div>
      </div>

      {/* Expanded Ritual Bar - Shows when items exist */}
      {totalItems > 0 && (
        <div className={`ritual-bar ${isAnimating ? 'pulse' : ''}`} onClick={openRitual}>
          <div className="ritual-bar-glow"></div>
          <div className="ritual-bar-content">
            <div className="ritual-bar-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M12 2C12 2 8 6 8 12C8 16 10 20 12 22C14 20 16 16 16 12C16 6 12 2 12 2Z" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path d="M12 22V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="ritual-bar-info">
              <span className="ritual-bar-title">{t.ritualTitle}</span>
              <span className="ritual-bar-preview">
                {previewItems.map((item, i) => (
                  <span key={item.id}>
                    {item[currentLang]}{i < previewItems.length - 1 ? '、' : ''}
                  </span>
                ))}
                {ritualItems.length > 3 && <span> +{ritualItems.length - 3}</span>}
              </span>
            </div>
            <div className="ritual-bar-count">
              <span className="count-num">{totalItems}</span>
              <span className="count-label">{t.ritualItems}</span>
            </div>
            <div className="ritual-bar-arrow">
              <span>→</span>
            </div>
          </div>
          <div className="ritual-bar-shimmer"></div>
        </div>
      )}

      {/* Small Floating Button - Shows when NO items */}
      {totalItems === 0 && (
        <button 
          className="ritual-fab-empty"
          onClick={toggleRitual}
          aria-label={t.ritualOpen}
        >
          <div className="fab-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M12 2C12 2 8 6 8 12C8 16 10 20 12 22C14 20 16 16 16 12C16 6 12 2 12 2Z" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path d="M12 22V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M8 8C6 9 4 11 4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M16 8C18 9 20 11 20 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        </button>
      )}
    </>
  );
};

export default RitualButton;

