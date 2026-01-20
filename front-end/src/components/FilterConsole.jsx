import React from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { orgValues, scnValues } from '../data/i18n.js';
import './FilterConsole.css';

const FilterConsole = ({ filters, onFilterChange }) => {
  const { t } = useLanguage();

  const handleFilterClick = (filterType, value) => {
    onFilterChange(filterType, value);
  };

  const handleSelectChange = (filterType, e) => {
    onFilterChange(filterType, e.target.value);
  };

  return (
    <div className="console">
      {/* Desktop/Tablet: Button filters */}
      <div className="filter-group desktop-filters">
        <div className="filter-label">{t.lblOrg}</div>
        <div className="filter-buttons">
          {orgValues.map((value, index) => (
            <button
              key={value}
              className={`t-btn ${filters.org === value ? 'active' : ''}`}
              onClick={() => handleFilterClick('org', value)}
            >
              {t.orgs[index]}
            </button>
          ))}
        </div>
      </div>
      <div className="filter-group desktop-filters">
        <div className="filter-label">{t.lblScn}</div>
        <div className="filter-buttons">
          {scnValues.map((value, index) => (
            <button
              key={value}
              className={`t-btn ${filters.scn === value ? 'active' : ''}`}
              onClick={() => handleFilterClick('scn', value)}
            >
              {t.scns[index]}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile: Dropdown filters */}
      <div className="mobile-filters">
        <div className="dropdown-group">
          <label className="dropdown-label">{t.lblOrg}</label>
          <select 
            className="filter-dropdown"
            value={filters.org}
            onChange={(e) => handleSelectChange('org', e)}
          >
            {orgValues.map((value, index) => (
              <option key={value} value={value}>
                {t.orgs[index]}
              </option>
            ))}
          </select>
        </div>
        <div className="dropdown-group">
          <label className="dropdown-label">{t.lblScn}</label>
          <select 
            className="filter-dropdown"
            value={filters.scn}
            onChange={(e) => handleSelectChange('scn', e)}
          >
            {scnValues.map((value, index) => (
              <option key={value} value={value}>
                {t.scns[index]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterConsole;
