'use client';
import { useState, useRef, useEffect } from 'react';
import Icon from './Icon';
import { useI18n } from '@/lib/i18n';

const COLOR_HEX = {
  Beige: '#D9A899',
  Black: '#1F1A14',
  Blue: '#2E6F8E',
  Champagne: '#C9B89D',
  Charcoal: '#3A332C',
  Coral: '#D94B26',
  Cream: '#ECE5D8',
  Emerald: '#2E3B36',
  Navy: '#2A2118',
  Orange: '#D94B26',
  Pink: '#D9A899',
  Red: '#6B3A2E',
  Sage: '#9DB09A',
  Stone: '#C9B89D',
  White: '#F2E9D6',
  Wine: '#6B3A2E',
  Yellow: '#F4C95D',
};

export default function PLPFilters({
  brandId,
  availableSizes = [],
  availableColors = [],
  activeSize,
  setActiveSize,
  activeColor,
  setActiveColor,
  activePriceRange,
  setActivePriceRange,
  activeSort,
  setActiveSort,
  onClear,
}) {
  const { t } = useI18n();
  const [openPanel, setOpenPanel] = useState(null); // 'size', 'color', 'price', 'sort', or null
  const panelRef = useRef(null);

  // Close panel on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setOpenPanel(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const togglePanel = (panel) => {
    setOpenPanel(prev => prev === panel ? null : panel);
  };

  const sizeOptions = availableSizes.length > 0 ? availableSizes : ['XS', 'S', 'M', 'L', 'XL'];
  const colorSwatches = availableColors.length > 0
    ? availableColors.map(name => ({ name, hex: COLOR_HEX[name] || 'var(--brand-primary)' }))
    : ({
        happybuy: [
          { name: 'Yellow', hex: '#F4C95D' },
          { name: 'Red/Terracotta', hex: '#D94B26' },
          { name: 'Indigo/Dark', hex: '#2E6F8E' },
          { name: 'Green/Sage', hex: '#9DB09A' },
          { name: 'Neutral/Cream', hex: '#D9A899' },
        ],
        cleopatra: [
          { name: 'Neutral/Cream', hex: '#F2E9D6' },
          { name: 'Red/Terracotta', hex: '#6B3A2E' },
          { name: 'Indigo/Dark', hex: '#2A2118' },
          { name: 'Green/Sage', hex: '#2E3B36' },
        ],
        modabella: [
          { name: 'Neutral/Cream', hex: '#ECE5D8' },
          { name: 'Red/Terracotta', hex: '#D9A899' },
          { name: 'Indigo/Dark', hex: '#3A332C' },
          { name: 'Green/Sage', hex: '#9DB09A' },
        ],
      }[brandId] || []);

  // Brand-specific price ranges
  const priceRanges = {
    happybuy: [
      { key: 'low', label: 'Under LKR 3,000' },
      { key: 'mid', label: 'LKR 3,000 - 4,000' },
      { key: 'high', label: 'Over LKR 4,000' },
    ],
    cleopatra: [
      { key: 'low', label: 'Under LKR 50,000' },
      { key: 'high', label: 'Over LKR 50,000' },
    ],
    modabella: [
      { key: 'low', label: 'Under LKR 10,000' },
      { key: 'high', label: 'Over LKR 10,000' },
    ],
  }[brandId] || [];

  const sortOptions = [
    { key: 'default', label: 'Default/New' },
    { key: 'price-asc', label: 'Low to High' },
    { key: 'price-desc', label: 'High to Low' },
    { key: 'rating', label: 'Rating' },
  ];

  const hasActiveFilters = activeSize || activeColor || activePriceRange || activeSort !== 'default';

  return (
    <div className="plp-filters-wrapper" ref={panelRef} style={{ position: 'relative', zIndex: 10 }}>
      <div className="plp-filters">
        {/* All Filters Button / Reset badge */}
        <button 
          className={`chip ${hasActiveFilters ? 'is-active' : ''}`}
          onClick={hasActiveFilters ? onClear : () => togglePanel('filters')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <Icon name="filter" size={14}/> 
          {hasActiveFilters ? `${t('Clear all', brandId)}` : t('Filters', brandId)}
        </button>

        {/* Size Filter Chip */}
        <button 
          className={`chip ${activeSize ? 'is-active' : ''}`}
          onClick={() => togglePanel('size')}
        >
          {activeSize ? `${t('Size', brandId)}: ${activeSize}` : t('Size', brandId)}
          <span style={{ display: 'inline-flex', transform: openPanel === 'size' ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-fast)' }}>
            <Icon name="chevron-d" size={14}/>
          </span>
        </button>

        {/* Color Filter Chip */}
        <button 
          className={`chip ${activeColor ? 'is-active' : ''}`}
          onClick={() => togglePanel('color')}
        >
          {activeColor ? `${t('Color', brandId)}: ${t(activeColor, brandId)}` : t('Color', brandId)}
          <span style={{ display: 'inline-flex', transform: openPanel === 'color' ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-fast)' }}>
            <Icon name="chevron-d" size={14}/>
          </span>
        </button>

        {/* Price Filter Chip */}
        <button 
          className={`chip ${activePriceRange ? 'is-active' : ''}`}
          onClick={() => togglePanel('price')}
        >
          {activePriceRange ? `${t('Price', brandId)}: ${t(priceRanges.find(r => r.key === activePriceRange)?.label, brandId)}` : t('Price', brandId)}
          <span style={{ display: 'inline-flex', transform: openPanel === 'price' ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-fast)' }}>
            <Icon name="chevron-d" size={14}/>
          </span>
        </button>

        {/* Sort Chip */}
        <button 
          className={`chip ml-auto ${activeSort !== 'default' ? 'is-active' : ''}`}
          onClick={() => togglePanel('sort')}
        >
          {t(sortOptions.find(o => o.key === activeSort)?.label, brandId)}
          <span style={{ display: 'inline-flex', transform: openPanel === 'sort' ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-fast)' }}>
            <Icon name="chevron-d" size={14}/>
          </span>
        </button>
      </div>

      {/* Floating Glassmorphic Dropdowns */}
      {openPanel && openPanel !== 'filters' && (
        <div className="filter-dropdown glass-card animate-fade-in" style={{
          position: 'absolute',
          top: '100%',
          left: openPanel === 'sort' ? 'auto' : '0',
          right: openPanel === 'sort' ? '0' : 'auto',
          marginTop: '8px',
          padding: '16px',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--brand-border-subtle)',
          boxShadow: 'var(--shadow-dropdown)',
          maxWidth: '320px',
          width: 'max-content',
          minWidth: '240px',
          zIndex: 20,
        }}>
          {/* SIZE PANEL */}
          {openPanel === 'size' && (
            <div>
              <h4 className="eyebrow" style={{ marginBottom: '12px' }}>{t('Select size', brandId)}</h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {sizeOptions.map(sz => (
                  <button
                    key={sz}
                    className={`size-pill ${activeSize === sz ? 'is-on' : ''}`}
                    onClick={() => {
                      setActiveSize(prev => prev === sz ? null : sz);
                      setOpenPanel(null);
                    }}
                    style={{ minWidth: '40px', height: '40px' }}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* COLOR PANEL */}
          {openPanel === 'color' && (
            <div>
              <h4 className="eyebrow" style={{ marginBottom: '12px' }}>{t('Select color', brandId)}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {colorSwatches.map(sw => (
                  <button
                    key={sw.name}
                    onClick={() => {
                      setActiveColor(prev => prev === sw.name ? null : sw.name);
                      setOpenPanel(null);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      background: activeColor === sw.name ? 'var(--brand-surface-2)' : 'transparent',
                      border: 0,
                      borderRadius: 'var(--radius-sm)',
                      padding: '8px',
                      width: '100%',
                      cursor: 'pointer',
                      textAlign: 'left',
                      color: 'var(--brand-text)',
                      transition: 'background var(--dur-fast)'
                    }}
                  >
                    <span style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: sw.hex,
                      border: sw.hex === '#ECE5D8' || sw.hex === '#F2E9D6' ? '1px solid var(--brand-border)' : '0',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}/>
                    <span style={{ fontSize: '14px', fontWeight: activeColor === sw.name ? '600' : '400' }}>
                      {t(sw.name, brandId)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PRICE PANEL */}
          {openPanel === 'price' && (
            <div>
              <h4 className="eyebrow" style={{ marginBottom: '12px' }}>{t('Select price range', brandId)}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {priceRanges.map(pr => (
                  <button
                    key={pr.key}
                    onClick={() => {
                      setActivePriceRange(prev => prev === pr.key ? null : pr.key);
                      setOpenPanel(null);
                    }}
                    style={{
                      background: activePriceRange === pr.key ? 'var(--brand-surface-2)' : 'transparent',
                      border: 0,
                      borderRadius: 'var(--radius-sm)',
                      padding: '8px 12px',
                      width: '100%',
                      cursor: 'pointer',
                      textAlign: 'left',
                      color: 'var(--brand-text)',
                      fontSize: '14px',
                      fontWeight: activePriceRange === pr.key ? '600' : '400',
                      transition: 'background var(--dur-fast)'
                    }}
                  >
                    {t(pr.label, brandId)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SORT PANEL */}
          {openPanel === 'sort' && (
            <div>
              <h4 className="eyebrow" style={{ marginBottom: '12px' }}>{t('Sort by', brandId)}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {sortOptions.map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => {
                      setActiveSort(opt.key);
                      setOpenPanel(null);
                    }}
                    style={{
                      background: activeSort === opt.key ? 'var(--brand-surface-2)' : 'transparent',
                      border: 0,
                      borderRadius: 'var(--radius-sm)',
                      padding: '8px 12px',
                      width: '100%',
                      cursor: 'pointer',
                      textAlign: 'left',
                      color: 'var(--brand-text)',
                      fontSize: '14px',
                      fontWeight: activeSort === opt.key ? '600' : '400',
                      transition: 'background var(--dur-fast)'
                    }}
                  >
                    {t(opt.label, brandId)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
