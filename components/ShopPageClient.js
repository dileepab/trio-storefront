'use client';
import { useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import PLPFilters from '@/components/PLPFilters';
import { useI18n } from '@/lib/i18n';

function numericPrice(item) {
  if (typeof item.priceNumber === 'number') {
    return item.priceNumber;
  }

  return Number.parseInt(String(item.price || '0').replace(/,/g, ''), 10) || 0;
}

function colorGroup(hex) {
  if (!hex) return 'Other';
  const h = hex.toUpperCase();
  if (h === '#F4C95D') return 'Yellow';
  if (h === '#D94B26' || h === '#6B3A2E' || h === '#4F2A21') return 'Red/Terracotta';
  if (h === '#2E6F8E' || h === '#1F1A14' || h === '#2A2118') return 'Indigo/Dark';
  if (h === '#9DB09A' || h === '#5A6450' || h === '#2E3B36') return 'Green/Sage';
  if (h === '#D9A899' || h === '#B8762B' || h === '#ECE5D8' || h === '#F2E9D6' || h === '#A07A3A' || h === '#C9B89D') return 'Neutral/Cream';
  return 'Other';
}

function matchesColor(item, activeColor) {
  if (!activeColor) {
    return true;
  }

  if (Array.isArray(item.colors) && item.colors.length > 0) {
    return item.colors.some(color => color.toLowerCase() === activeColor.toLowerCase());
  }

  return colorGroup(item.swatchA) === activeColor || colorGroup(item.swatchB) === activeColor;
}

export default function ShopPageClient({ brand, products }) {
  const { t } = useI18n();
  const [activeSize, setActiveSize] = useState(null);
  const [activeColor, setActiveColor] = useState(null);
  const [activePriceRange, setActivePriceRange] = useState(null);
  const [activeSort, setActiveSort] = useState('default');

  const availableSizes = useMemo(() => {
    const values = products.flatMap(item => Array.isArray(item.sizes) ? item.sizes : []);
    return [...new Set(values)].sort((a, b) => {
      const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
      const aIndex = order.indexOf(a);
      const bIndex = order.indexOf(b);
      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex) || a.localeCompare(b);
    });
  }, [products]);

  const availableColors = useMemo(() => {
    const values = products.flatMap(item => Array.isArray(item.colors) ? item.colors : []);
    return [...new Set(values)].sort((a, b) => a.localeCompare(b));
  }, [products]);

  const filteredItems = useMemo(() => {
    return products.filter(item => {
      if (activeSize && !(Array.isArray(item.sizes) && item.sizes.includes(activeSize))) {
        return false;
      }

      if (!matchesColor(item, activeColor)) {
        return false;
      }

      if (activePriceRange) {
        const itemPrice = numericPrice(item);
        if (brand.id === 'happybuy') {
          if (activePriceRange === 'low' && itemPrice >= 3000) return false;
          if (activePriceRange === 'mid' && (itemPrice < 3000 || itemPrice > 4000)) return false;
          if (activePriceRange === 'high' && itemPrice <= 4000) return false;
        } else if (brand.id === 'modabella') {
          if (activePriceRange === 'low' && itemPrice >= 10000) return false;
          if (activePriceRange === 'high' && itemPrice < 10000) return false;
        } else {
          if (activePriceRange === 'low' && itemPrice >= 50000) return false;
          if (activePriceRange === 'high' && itemPrice < 50000) return false;
        }
      }

      return true;
    });
  }, [products, activeSize, activeColor, activePriceRange, brand.id]);

  const sortedAndFilteredItems = useMemo(() => {
    const itemsCopy = [...filteredItems];
    if (activeSort === 'price-asc') {
      return itemsCopy.sort((a, b) => numericPrice(a) - numericPrice(b));
    }
    if (activeSort === 'price-desc') {
      return itemsCopy.sort((a, b) => numericPrice(b) - numericPrice(a));
    }
    if (activeSort === 'rating') {
      return itemsCopy.sort((a, b) => Number.parseFloat(b.rating || 0) - Number.parseFloat(a.rating || 0));
    }
    return itemsCopy;
  }, [filteredItems, activeSort]);

  const clearAllFilters = () => {
    setActiveSize(null);
    setActiveColor(null);
    setActivePriceRange(null);
    setActiveSort('default');
  };

  return (
    <main className="plp-page">
      <div className="plp-head">
        <h1 className="h1">{t(brand.id === 'modabella' ? 'shop' : 'Shop all', brand.id)}</h1>
        <p className="caption">{sortedAndFilteredItems.length} {t('items', brand.id)}</p>
      </div>

      <PLPFilters
        brandId={brand.id}
        availableSizes={availableSizes}
        availableColors={availableColors}
        activeSize={activeSize}
        setActiveSize={setActiveSize}
        activeColor={activeColor}
        setActiveColor={setActiveColor}
        activePriceRange={activePriceRange}
        setActivePriceRange={setActivePriceRange}
        activeSort={activeSort}
        setActiveSort={setActiveSort}
        onClear={clearAllFilters}
      />

      {sortedAndFilteredItems.length === 0 ? (
        <div className="plp-empty text-center glass-card" style={{
          padding: '60px 20px',
          borderRadius: 'var(--radius)',
          marginTop: '20px',
          border: '1px solid var(--brand-border-subtle)'
        }}>
          <h3 className="h3" style={{ marginBottom: '20px', fontWeight: '500' }}>
            {t('No items found matching your filters.', brand.id)}
          </h3>
          <button className="btn primary lg" onClick={clearAllFilters}>{t('Clear all', brand.id)}</button>
        </div>
      ) : (
        <div className="plp-grid" style={{ transition: 'opacity 0.2s ease-in-out' }}>
          {sortedAndFilteredItems.map((p) => (
            <ProductCard key={p.slug} brand={brand.id} {...p}/>
          ))}
        </div>
      )}
    </main>
  );
}
