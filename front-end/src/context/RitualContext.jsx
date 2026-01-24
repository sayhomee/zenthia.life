import React, { createContext, useContext, useState, useCallback } from 'react';

const RitualContext = createContext();

export const RitualProvider = ({ children }) => {
  const [ritualItems, setRitualItems] = useState([]);
  const [isRitualOpen, setIsRitualOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [addedTimestamp, setAddedTimestamp] = useState(null); // Use timestamp to detect every add

  const addToRitual = useCallback((product) => {
    setRitualItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    // Use timestamp to trigger animation even for same item
    setAddedTimestamp(Date.now());
  }, []);

  const removeFromRitual = useCallback((productId) => {
    setRitualItems(prev => prev.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromRitual(productId);
      return;
    }
    setRitualItems(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }, [removeFromRitual]);

  const clearRitual = useCallback(() => {
    setRitualItems([]);
  }, []);

  const totalItems = ritualItems.reduce((sum, item) => sum + item.quantity, 0);

  const openRitual = useCallback(() => setIsRitualOpen(true), []);
  const closeRitual = useCallback(() => setIsRitualOpen(false), []);
  const toggleRitual = useCallback(() => setIsRitualOpen(prev => !prev), []);
  
  const openCheckout = useCallback(() => {
    setIsRitualOpen(false);
    setIsCheckoutOpen(true);
  }, []);
  const closeCheckout = useCallback(() => setIsCheckoutOpen(false), []);

  return (
    <RitualContext.Provider value={{
      ritualItems,
      totalItems,
      isRitualOpen,
      isCheckoutOpen,
      addedTimestamp,
      addToRitual,
      removeFromRitual,
      updateQuantity,
      clearRitual,
      openRitual,
      closeRitual,
      toggleRitual,
      openCheckout,
      closeCheckout
    }}>
      {children}
    </RitualContext.Provider>
  );
};

export const useRitual = () => {
  const context = useContext(RitualContext);
  if (!context) {
    throw new Error('useRitual must be used within a RitualProvider');
  }
  return context;
};

