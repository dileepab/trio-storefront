'use client';
import { useState, useRef, useEffect, useId } from 'react';
import Icon from './Icon';
import { useI18n } from '@/lib/i18n';
import { colorHex, isPale } from '@/lib/colors';

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
  const dropdownRef = useRef(null);
  const chipRefs = useRef({});
  const uid = useId();
  const panelId = (key) => `${uid}-panel-${key}`;

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

  // Escape closes the open panel and hands focus back to its chip, which is
  // the only way out for a keyboard user who is not going to click elsewhere.
  useEffect(() => {
    if (!openPanel) return;
    function handleKeyDown(event) {
      if (event.key !== 'Escape') return;
      const key = openPanel;
      setOpenPanel(null);
      chipRefs.current[key]?.focus();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [openPanel]);

  // Move focus into the panel when it opens, so the options are the next thing
  // a keyboard user reaches rather than the chip after it.
  useEffect(() => {
    if (!openPanel || openPanel === 'filters') return;
    const first = dropdownRef.current?.querySelector('button');
    first?.focus();
  }, [openPanel]);

  const togglePanel = (panel) => {
    setOpenPanel(prev => prev === panel ? null : panel);
  };

  // Shared disclosure wiring for each filter chip
  const chipProps = (key) => ({
    type: 'button',
    ref: (el) => { chipRefs.current[key] = el; },
    'aria-expanded': openPanel === key,
    'aria-haspopup': 'true',
    'aria-controls': openPanel === key ? panelId(key) : undefined,
  });

  const sizeOptions = availableSizes.length > 0 ? availableSizes : ['XS', 'S', 'M', 'L', 'XL'];
  const colorSwatches = availableColors.length > 0
    ? availableColors.map(name => ({ name, hex: colorHex(name) }))
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
          type="button"
          className={`chip ${hasActiveFilters ? 'is-active' : ''}`}
          onClick={hasActiveFilters ? onClear : () => togglePanel('filters')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <Icon name="filter" size={14}/>
          {hasActiveFilters ? `${t('Clear all', brandId)}` : t('Filters', brandId)}
        </button>

        {/* Size Filter Chip */}
        <button
          {...chipProps('size')}
          className={`chip ${activeSize ? 'is-active' : ''}`}
          onClick={() => togglePanel('size')}
        >
          {activeSize ? `${t('Size', brandId)}: ${activeSize}` : t('Size', brandId)}
          <span aria-hidden="true" style={{ display: 'inline-flex', transform: openPanel === 'size' ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-fast)' }}>
            <Icon name="chevron-d" size={14}/>
          </span>
        </button>

        {/* Color Filter Chip */}
        <button
          {...chipProps('color')}
          className={`chip ${activeColor ? 'is-active' : ''}`}
          onClick={() => togglePanel('color')}
        >
          {activeColor ? `${t('Color', brandId)}: ${t(activeColor, brandId)}` : t('Color', brandId)}
          <span aria-hidden="true" style={{ display: 'inline-flex', transform: openPanel === 'color' ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-fast)' }}>
            <Icon name="chevron-d" size={14}/>
          </span>
        </button>

        {/* Price Filter Chip */}
        <button
          {...chipProps('price')}
          className={`chip ${activePriceRange ? 'is-active' : ''}`}
          onClick={() => togglePanel('price')}
        >
          {activePriceRange ? `${t('Price', brandId)}: ${t(priceRanges.find(r => r.key === activePriceRange)?.label, brandId)}` : t('Price', brandId)}
          <span aria-hidden="true" style={{ display: 'inline-flex', transform: openPanel === 'price' ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-fast)' }}>
            <Icon name="chevron-d" size={14}/>
          </span>
        </button>

        {/* Sort Chip */}
        <button
          {...chipProps('sort')}
          className={`chip ml-auto ${activeSort !== 'default' ? 'is-active' : ''}`}
          onClick={() => togglePanel('sort')}
        >
          <span className="visually-hidden">{t('Sort by', brandId)}: </span>
          {t(sortOptions.find(o => o.key === activeSort)?.label, brandId)}
          <span aria-hidden="true" style={{ display: 'inline-flex', transform: openPanel === 'sort' ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-fast)' }}>
            <Icon name="chevron-d" size={14}/>
          </span>
        </button>
      </div>

      {/* Floating Glassmorphic Dropdowns */}
      {openPanel && openPanel !== 'filters' && (
        <div
          ref={dropdownRef}
          id={panelId(openPanel)}
          role="group"
          aria-label={t(
            openPanel === 'size' ? 'Select size'
              : openPanel === 'color' ? 'Select color'
              : openPanel === 'price' ? 'Select price range'
              : 'Sort by',
            brandId
          )}
          className={`filter-dropdown animate-fade-in ${openPanel === 'sort' ? 'filter-dropdown--end' : 'filter-dropdown--start'}`}
        >
          {/* SIZE PANEL */}
          {openPanel === 'size' && (
            <div>
              <h4 className="eyebrow filter-dropdown-title">{t('Select size', brandId)}</h4>
              <div className="size-row">
                {sizeOptions.map(sz => (
                  <button
                    type="button"
                    key={sz}
                    aria-pressed={activeSize === sz}
                    className={`size-pill ${activeSize === sz ? 'is-on' : ''}`}
                    onClick={() => {
                      setActiveSize(prev => prev === sz ? null : sz);
                      setOpenPanel(null);
                    }}
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
              <h4 className="eyebrow filter-dropdown-title">{t('Select color', brandId)}</h4>
              <div className="filter-option-list">
                {colorSwatches.map(sw => (
                  <button
                    type="button"
                    key={sw.name}
                    aria-pressed={activeColor === sw.name}
                    className={`filter-option ${activeColor === sw.name ? 'is-on' : ''}`}
                    onClick={() => {
                      setActiveColor(prev => prev === sw.name ? null : sw.name);
                      setOpenPanel(null);
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className={`filter-swatch ${isPale(sw.hex) ? 'filter-swatch--pale' : ''}`}
                      style={{ background: sw.hex }}
                    />
                    <span>{t(sw.name, brandId)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PRICE PANEL */}
          {openPanel === 'price' && (
            <div>
              <h4 className="eyebrow filter-dropdown-title">{t('Select price range', brandId)}</h4>
              <div className="filter-option-list">
                {priceRanges.map(pr => (
                  <button
                    type="button"
                    key={pr.key}
                    aria-pressed={activePriceRange === pr.key}
                    className={`filter-option ${activePriceRange === pr.key ? 'is-on' : ''}`}
                    onClick={() => {
                      setActivePriceRange(prev => prev === pr.key ? null : pr.key);
                      setOpenPanel(null);
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
              <h4 className="eyebrow filter-dropdown-title">{t('Sort by', brandId)}</h4>
              <div className="filter-option-list">
                {sortOptions.map(opt => (
                  <button
                    type="button"
                    key={opt.key}
                    aria-pressed={activeSort === opt.key}
                    className={`filter-option ${activeSort === opt.key ? 'is-on' : ''}`}
                    onClick={() => {
                      setActiveSort(opt.key);
                      setOpenPanel(null);
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
