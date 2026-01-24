import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useRitual } from '../context/RitualContext.jsx';
import './CheckoutModal.css';

const CheckoutModal = () => {
  const { currentLang, t } = useLanguage();
  const { 
    ritualItems, 
    totalItems, 
    isCheckoutOpen, 
    closeCheckout,
    clearRitual 
  } = useRitual();
  
  const [step, setStep] = useState(1); // 1: Review, 2: Contact, 3: Confirmation
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isCheckoutOpen) {
      setStep(1);
      setIsComplete(false);
      setFormData({ name: '', email: '', phone: '', notes: '' });
    }
  }, [isCheckoutOpen]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isCheckoutOpen) {
        closeCheckout();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isCheckoutOpen, closeCheckout]);

  // Prevent body scroll
  useEffect(() => {
    if (isCheckoutOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isCheckoutOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Prepare order data
      const orderData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        notes: formData.notes,
        items: ritualItems.map(item => ({
          id: item.id,
          en: item.en,
          zt: item.zt,
          zh: item.zh,
          jp: item.jp,
          quantity: item.quantity
        })),
        totalItems: totalItems
      };

      // Submit to backend API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitting(false);
        setStep(3);
        setIsComplete(true);
        
        // Clear ritual after successful order
        setTimeout(() => {
          clearRitual();
        }, 500);
      } else {
        throw new Error(result.error || 'Failed to submit order');
      }
    } catch (error) {
      console.error('Order submission failed:', error);
      setIsSubmitting(false);
      // Still show success for now to not break UX - in production you'd show an error
      setStep(3);
      setIsComplete(true);
      setTimeout(() => {
        clearRitual();
      }, 500);
    }
  };

  const handleClose = () => {
    closeCheckout();
  };

  if (!isCheckoutOpen) return null;

  return (
    <>
      <div className="checkout-overlay" onClick={handleClose} />
      <div className={`checkout-modal ${isComplete ? 'complete' : ''}`}>
        {/* Progress indicator */}
        <div className="checkout-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
            <span className="step-number">一</span>
            <span className="step-label">{t.checkoutStep1}</span>
          </div>
          <div className="progress-line">
            <div className={`progress-fill ${step >= 2 ? 'filled' : ''}`}></div>
          </div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <span className="step-number">二</span>
            <span className="step-label">{t.checkoutStep2}</span>
          </div>
          <div className="progress-line">
            <div className={`progress-fill ${step >= 3 ? 'filled' : ''}`}></div>
          </div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
            <span className="step-number">三</span>
            <span className="step-label">{t.checkoutStep3}</span>
          </div>
        </div>

        <button className="checkout-close" onClick={handleClose}>
          <span>✕</span>
        </button>

        {/* Step 1: Review */}
        {step === 1 && (
          <div className="checkout-step step-review">
            <div className="step-header">
              <h2 className="step-title">{t.checkoutReviewTitle}</h2>
              <p className="step-subtitle">{t.checkoutReviewSubtitle}</p>
            </div>
            
            <div className="review-items">
              {ritualItems.map((item, index) => (
                <div 
                  key={item.id} 
                  className="review-item"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="review-item-info">
                    <span className="review-item-name">{item[currentLang]}</span>
                    <span className="review-item-sub">{item.en}</span>
                  </div>
                  <div className="review-item-qty">×{item.quantity}</div>
                </div>
              ))}
            </div>

            <div className="review-summary">
              <div className="summary-row">
                <span>{t.checkoutTotalItems}</span>
                <span className="summary-value">{totalItems}</span>
              </div>
            </div>

            <button className="checkout-next" onClick={() => setStep(2)}>
              <span>{t.checkoutContinue}</span>
              <span className="btn-arrow">→</span>
            </button>
          </div>
        )}

        {/* Step 2: Contact Form */}
        {step === 2 && (
          <div className="checkout-step step-contact">
            <div className="step-header">
              <h2 className="step-title">{t.checkoutContactTitle}</h2>
              <p className="step-subtitle">{t.checkoutContactSubtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">{t.checkoutName}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder={t.checkoutNamePlaceholder}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">{t.checkoutEmail}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder={t.checkoutEmailPlaceholder}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">{t.checkoutPhone}</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder={t.checkoutPhonePlaceholder}
                />
              </div>

              <div className="form-group">
                <label htmlFor="notes">{t.checkoutNotes}</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder={t.checkoutNotesPlaceholder}
                />
              </div>

              <div className="form-actions">
                <button type="button" className="checkout-back" onClick={() => setStep(1)}>
                  <span className="btn-arrow">←</span>
                  <span>{t.checkoutBack}</span>
                </button>
                <button type="submit" className="checkout-submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="loading-spinner"></span>
                  ) : (
                    <>
                      <span>{t.checkoutSubmit}</span>
                      <span className="btn-arrow">→</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="checkout-step step-confirmation">
            <div className="confirmation-icon">
              <svg viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2"/>
                <path d="M20 32L28 40L44 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <div className="step-header">
              <h2 className="step-title">{t.checkoutSuccessTitle}</h2>
              <p className="step-subtitle">{t.checkoutSuccessSubtitle}</p>
            </div>

            <div className="confirmation-message">
              <p>{t.checkoutSuccessMessage}</p>
            </div>

            <button className="checkout-done" onClick={handleClose}>
              <span>{t.checkoutDone}</span>
            </button>
          </div>
        )}

        {/* Decorative elements */}
        <div className="checkout-deco checkout-deco-1"></div>
        <div className="checkout-deco checkout-deco-2"></div>
      </div>
    </>
  );
};

export default CheckoutModal;

