'use client';
import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import Icon from './Icon';

export default function VirtualTryOn({ isOpen, onClose, product, brandId }) {
  const { t } = useI18n();
  const [selectedAvatar, setSelectedAvatar] = useState('M');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [fitScale, setFitScale] = useState(100);
  const [opacity, setOpacity] = useState(85);

  if (!isOpen) return null;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
    }
  };

  const getFitWarning = () => {
    if (fitScale > 115) {
      return t('Oversized') + ' - ' + t('Oversized style drape (recommended for casual fits)');
    }
    if (fitScale < 95) {
      return t('Fitted') + ' - ' + t('Tailored/snug fit (recommended to size up for casual drapes)');
    }
    return t('Size') + ' ' + selectedAvatar + ' - ' + t('Standard proportions matching catalog measurements');
  };

  return (
    <div className="vto-overlay" onClick={onClose}>
      <div className="vto-panel" onClick={(e) => e.stopPropagation()}>
        {/* Head */}
        <div className="vto-head">
          <div>
            <h2 className="h3 vto-title">{t('fitting room', brandId)}</h2>
            <span className="caption">{t('Virtual Try-On', brandId)} · {t(product.title, brandId)}</span>
          </div>
          <button className="vto-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        {/* Simulator Area */}
        <div className="vto-body">
          {/* VTO Canvas Box */}
          <div className="vto-canvas-container">
            {/* Background Model or Portrait */}
            {uploadedImage ? (
              <img src={uploadedImage} alt="User Portrait" className="vto-base-image" />
            ) : (
              <div className="vto-avatar-svg-container">
                {/* SVG Silhouette representation based on sizes */}
                <svg viewBox="0 0 200 400" className={`vto-avatar-silhouette vto-avatar--${selectedAvatar}`}>
                  <path 
                    fill="none" 
                    stroke="var(--brand-border)" 
                    strokeWidth="1.5" 
                    d="M100,50 C110,50 115,55 115,65 C115,75 110,80 100,80 C90,80 85,75 85,65 C85,55 90,50 100,50 Z 
                       M100,80 C80,90 70,110 65,140 C62,155 60,175 60,200 L68,200 L68,140 C72,120 85,100 100,100 C115,100 128,120 132,140 L132,200 L140,200 C140,175 138,155 135,140 C130,110 120,90 100,80 Z
                       M85,150 L85,280 C85,290 88,320 82,360 L92,360 L95,280 L100,280 L105,280 L108,360 L118,360 C112,320 115,290 115,280 L115,150 Z" 
                  />
                  <circle cx="100" cy="115" r="4" fill="var(--brand-border-subtle)" />
                  <circle cx="100" cy="150" r="4" fill="var(--brand-border-subtle)" />
                </svg>
              </div>
            )}

            {/* Overlaid Garment layer */}
            {product.image ? (
              <div 
                className="vto-garment-wrapper"
                style={{
                  transform: `translate(-50%, -45%) scale(${fitScale / 100})`,
                  opacity: opacity / 100
                }}
              >
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="vto-garment-overlay"
                />
              </div>
            ) : (
              <div 
                className="vto-garment-wrapper fallback-gradient"
                style={{
                  transform: `translate(-50%, -45%) scale(${fitScale / 100})`,
                  opacity: opacity / 100,
                  background: `linear-gradient(160deg, ${product.swatchA}, ${product.swatchB})`
                }}
              />
            )}
          </div>

          {/* Sizing & Controls Drawer */}
          <div className="vto-controls">
            {/* Avatars */}
            <div className="vto-control-section">
              <span className="eyebrow vto-section-label">{t('Select body shape', brandId)}</span>
              <div className="vto-avatar-selector-row">
                {['XS', 'S', 'M', 'L', 'XL'].map((sz) => (
                  <button 
                    key={sz} 
                    className={`vto-avatar-btn ${selectedAvatar === sz ? 'is-active' : ''}`}
                    onClick={() => {
                      setSelectedAvatar(sz);
                      setUploadedImage(null); // Clear uploaded image if switching to avatar silhouettes
                    }}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Portrait Upload */}
            <div className="vto-control-section">
              <span className="eyebrow vto-section-label">{t('Upload portrait', brandId)}</span>
              <label className="vto-upload-box">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  style={{ display: 'none' }}
                />
                <Icon name="user" size={18} />
                <span className="caption">{uploadedImage ? t('Change portrait', brandId) : t('Drag & drop or click to upload', brandId)}</span>
              </label>
            </div>

            {/* Sliders */}
            <div className="vto-control-section">
              <div className="vto-slider-header">
                <span className="eyebrow vto-section-label">{t('Fit Preference', brandId)}</span>
                <span className="caption">{fitScale}%</span>
              </div>
              <div className="vto-slider-row">
                <span className="caption">{t('Fitted', brandId)}</span>
                <input 
                  type="range" 
                  min="80" 
                  max="130" 
                  value={fitScale} 
                  onChange={(e) => setFitScale(parseInt(e.target.value))}
                  className="vto-slider"
                />
                <span className="caption">{t('Oversized', brandId)}</span>
              </div>
            </div>

            <div className="vto-control-section">
              <div className="vto-slider-header">
                <span className="eyebrow vto-section-label">{t('Drape Opacity', brandId)}</span>
                <span className="caption">{opacity}%</span>
              </div>
              <div className="vto-slider-row">
                <span className="caption">20%</span>
                <input 
                  type="range" 
                  min="20" 
                  max="100" 
                  value={opacity} 
                  onChange={(e) => setOpacity(parseInt(e.target.value))}
                  className="vto-slider"
                />
                <span className="caption">100%</span>
              </div>
            </div>

            {/* Feedback Alert */}
            <div className="vto-feedback-alert">
              <span className="vto-feedback-dot" />
              <p className="caption vto-feedback-text">{getFitWarning()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
