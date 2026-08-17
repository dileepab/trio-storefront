'use client';
import { useId } from 'react';
import { useI18n } from '@/lib/i18n';
import { useDialog } from '@/lib/useDialog';

/**
 * The size chart for the garment being viewed.
 *
 * The chart is chosen on the platform from the product's style — a skort is
 * measured against the skirt chart, a smocked sundress against the dress one —
 * and arrives on the product as `sizeChart`. Not every style has a chart drawn
 * yet, so the empty case says so and points at chat rather than showing a
 * broken image.
 */
export default function SizeChartModal({ isOpen, onClose, brand, sizeChart, productTitle }) {
  const { t } = useI18n();
  const uid = useId();
  const titleId = `${uid}-title`;
  const { panelRef, dialogProps } = useDialog({ isOpen, onClose, labelledBy: titleId });

  if (!isOpen) return null;

  const heading = sizeChart?.label
    ? `${t(sizeChart.label, brand)} · ${t('Size chart', brand)}`
    : t('Size chart', brand);

  return (
    <div className="sizechart-overlay" onClick={onClose}>
      <div
        className="sizechart-panel"
        ref={panelRef}
        {...dialogProps}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sizechart-head">
          <h2 className="h3 sizechart-title" id={titleId}>{heading}</h2>
          <button
            type="button"
            className="sizechart-close"
            onClick={onClose}
            aria-label={t('Close', brand)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div className="sizechart-body">
          {sizeChart?.imageUrl ? (
            <img
              src={sizeChart.imageUrl}
              alt={`${heading}${productTitle ? ` — ${productTitle}` : ''}`}
              className="sizechart-img"
            />
          ) : (
            <p className="body-sm sizechart-empty">
              {t('We have not published a size chart for this style yet. Message us and we will help you pick the right size.', brand)}
            </p>
          )}
        </div>

        <p className="caption sizechart-note">
          {t('Measurements are in centimetres and taken flat. Allow 1–2 cm variance.', brand)}
        </p>
      </div>
    </div>
  );
}
