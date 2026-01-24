import React, { useState, useMemo, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { RitualProvider } from './context/RitualContext.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import FilterConsole from './components/FilterConsole.jsx';
import Catalog from './components/Catalog.jsx';
import DetailPanel from './components/DetailPanel.jsx';
import RitualDrawer from './components/RitualDrawer.jsx';
import RitualButton from './components/RitualButton.jsx';
import CheckoutModal from './components/CheckoutModal.jsx';
import { products } from './data/products.js';
import './App.css';

const AppContent = () => {
  const [filters, setFilters] = useState({ org: 'all', scn: 'all' });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Check for product parameter in URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product');
    
    if (productId) {
      const product = products.find(p => p.id === productId);
      if (product) {
        setSelectedProduct(product);
        setIsPanelOpen(true);
        
        // Scroll to catalog section after a short delay
        setTimeout(() => {
          const catalogElement = document.querySelector('.catalog');
          if (catalogElement) {
            catalogElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 300);
      }
    }
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      (filters.org === 'all' || p.org.includes(filters.org)) && 
      (filters.scn === 'all' || p.scn.includes(filters.scn))
    );
  }, [filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const handleOpenDetail = (productId) => {
    const product = products.find(p => p.id === productId);
    setSelectedProduct(product);
    setIsPanelOpen(true);
  };

  const handleCloseDetail = () => {
    setIsPanelOpen(false);
    // Clear the URL parameter when closing
    const url = new URL(window.location);
    url.searchParams.delete('product');
    window.history.replaceState({}, '', url);
  };

  return (
    <>
      <Navbar />
      <Hero />
      <FilterConsole filters={filters} onFilterChange={handleFilterChange} />
      <Catalog products={filteredProducts} onOpenDetail={handleOpenDetail} />
      <DetailPanel 
        product={selectedProduct} 
        isOpen={isPanelOpen} 
        onClose={handleCloseDetail} 
      />
      <RitualDrawer />
      <RitualButton />
      <CheckoutModal />
    </>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <RitualProvider>
        <AppContent />
      </RitualProvider>
    </LanguageProvider>
  );
};

export default App;
