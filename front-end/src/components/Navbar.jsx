import React from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import './Navbar.css';

const Navbar = () => {
  const { currentLang, setLanguage } = useLanguage();

  const langButtons = [
    { code: 'zt', label: '繁體' },
    { code: 'en', label: 'EN' },
    { code: 'zh', label: '简体' },
    { code: 'jp', label: '日本語' }
  ];

  return (
    <nav className="navbar">
      <a href="#" className="logo">ZENTHIA</a>
      <div className="lang-switch">
        {langButtons.map(({ code, label }) => (
          <button
            key={code}
            className={currentLang === code ? 'active' : ''}
            onClick={() => setLanguage(code)}
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;

