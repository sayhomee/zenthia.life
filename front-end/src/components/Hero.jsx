import React from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import './Hero.css';

const Hero = () => {
  const { t } = useLanguage();

  return (
    <header className="hero">
      <div className="we-are-text">We are what we drink</div>
      <h1>{t.title}</h1>
      <div className="manifesto">
        <p>{t.man[0]}</p>
        <p>{t.man[1]}</p>
        <p>{t.man[2]}</p>
        <div className="divider"></div>
      </div>
    </header>
  );
};

export default Hero;

